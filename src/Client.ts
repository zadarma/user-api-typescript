import * as crypto from 'crypto'

export class ApiException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiException'
  }
}

export class Client {
  private static readonly PROD_URL = 'https://api.zadarma.com'
  private static readonly SANDBOX_URL = 'https://api-sandbox.zadarma.com'

  private readonly apiUrl: string
  private readonly key: string
  private readonly secret: string
  private httpCode: number = 0
  private limits: Record<string, number> = {}

  /**
   * @param key
   * @param secret
   * @param isSandbox
   */
  constructor(key: string, secret: string, isSandbox: boolean = false) {
    this.apiUrl = isSandbox ? Client.SANDBOX_URL : Client.PROD_URL
    this.key = key
    this.secret = secret
  }

  /**
   * @param method - API method, including version number
   * @param params - Query params
   * @param requestType - (get|post|put|delete)
   * @param format - (json|xml)
   */
  public async call<T = any>(method: string, params: Record<string, any> = {}, requestType: string = 'get', format: string = 'json'): Promise<T> {
    const type = requestType.toUpperCase()
    const validTypes = ['GET', 'POST', 'PUT', 'DELETE']
    if (!validTypes.includes(type)) {
      throw new ApiException('Invalid request type specified.')
    }

    params.format = format

    const authHeader = this.getAuthHeader(method, params)

    let url = `${this.apiUrl}${method}`
    const headers = new Headers(authHeader)
    const options: RequestInit = {
      method: type,
      headers,
    }

    if (type === 'GET') {
      url = `${url}?${this.httpBuildQuery(params)}`
    } else {
      options.body = this.httpBuildQuery(params)
      headers.set('Content-Type', 'application/x-www-form-urlencoded')
    }

    try {
      const response = await fetch(url, options)
      this.httpCode = response.status
      this.parseHeaders(response.headers)

      const data = await response.json()

      if (!response.ok) {
        throw new ApiException(data.message || 'An error occurred')
      }

      return data as T
    } catch (error) {
      if (error instanceof ApiException) {
        throw error
      } else if (error instanceof Error) {
        throw new ApiException(error.message)
      }
      throw new ApiException('An unknown error occurred')
    }
  }

  public getHttpCode(): number {
    return this.httpCode
  }

  public getLimits(): Record<string, number> {
    return this.limits
  }

  /**
   * @param method
   * @param params
   * @private
   */
  private getAuthHeader(method: string, params: Record<string, any>): Record<string, string> {
    const sortedParams = Object.keys(params)
      .filter(key => typeof params[key] !== 'object' || params[key] === null)
      .sort()
      .reduce((obj, key) => {
        obj[key] = params[key]
        return obj
      }, {} as Record<string, any>)

    const paramsString = this.httpBuildQuery(sortedParams)
    const md5Params = crypto.createHash('md5').update(paramsString).digest('hex')
    const signatureString = method + paramsString + md5Params
    const signature = this.encodeSignature(signatureString)

    return {Authorization: `${this.key}:${signature}`}
  }

  /**
   * @param signatureString
   * @private
   */
  private encodeSignature(signatureString: string): string {
    const sha1 = crypto.createHmac('sha1', this.secret).update(signatureString).digest('hex')
    return Buffer.from(sha1).toString('base64')
  }

  /**
   * @param headers
   * @private
   */
  private parseHeaders(headers: Headers): void {
    this.limits = {}
    headers.forEach((value, key) => {
      if (key.toLowerCase().startsWith('x-ratelimit-')) {
        const limitName = key.toLowerCase().replace('x-ratelimit-', '')
        this.limits[limitName] = parseInt(value, 10)
      }
    })
  }

  /**
   * Build HTTP query
   * @param params
   * @private
   */
  private httpBuildQuery(params: Record<string, any>): string {
    return new URLSearchParams(params).toString().replace(/%20/g, '+')
  }
}
