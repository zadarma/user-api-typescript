import {Client, ApiException} from './Client'
import * as responses from './types'

export class Api extends Client {
  private static readonly VERSION = 'v1'

  /**
   * Return user balance.
   */
  public async getBalance(): Promise<responses.Balance> {
    const data = await this.request('info/balance')
    return data as responses.Balance
  }

  /**
   * Return call rate in the user's current price plan.
   * @param number
   * @param callerId
   */
  public async getPrice(number: string, callerId?: string): Promise<responses.Price> {
    const params: {number: string; caller_id?: string} = {number: this.filterNumber(number)}
    if (callerId) {
      params.caller_id = this.filterNumber(callerId)
    }
    const data = await this.request('info/price', params)
    return data.info as responses.Price
  }

  /**
   * Return user's timezone.
   */
  public async getTimezone(): Promise<responses.Timezone> {
    const data = await this.request('info/timezone')
    return data as responses.Timezone
  }

  /**
   * Return information about the user's current price plan.
   */
  public async getTariff(): Promise<responses.Tariff> {
    const data = await this.request('tariff')
    return data.info as responses.Tariff
  }

  /**
   * Request a callback.
   * @see https://zadarma.com/en/services/calls/callback/
   * @param from Your phone/SIP number, the PBX extension number or the PBX scenario, to which the CallBack is made.
   * @param to The phone or SIP number that is being called.
   * @param sip SIP user's number or the PBX extension number, which is used to make the call.
   * @param predicted If this flag is specified the request is predicted (the system calls the “to” number, and only connects it to your SIP, or your phone number, if the call is successful.);
   */
  public async requestCallback(from: string, to: string, sip?: string, predicted?: boolean): Promise<responses.RequestCallback> {
    const params: {from: string; to: string; sip?: string; predicted?: boolean} = {
      from,
      to: this.filterNumber(to),
    }
    if (sip) {
      params.sip = this.filterNumber(sip)
    }
    if (predicted) {
      params.predicted = predicted
    }
    const data = await this.request('request/callback', params)
    return data as responses.RequestCallback
  }

  /**
   * Return the list of user's SIP-numbers.
   */
  public async getSip(): Promise<{sips: responses.Sip[]}> {
    const data = await this.request('sip')
    return data as {sips: responses.Sip[]}
  }

  /**
   * Return the user's SIP number online status.
   * @param sipId
   */
  public async getSipStatus(sipId: string): Promise<responses.SipStatus> {
    const data = await this.request(`sip/${this.filterNumber(sipId)}/status`)
    return data as responses.SipStatus
  }

  /**
   * Return the current call forwarding based on the user's SIP numbers.
   * @param sipId Selection of the specific SIP ID.
   */
  public async getSipRedirection(sipId?: string): Promise<responses.Redirection[]> {
    const params = sipId ? {id: this.filterNumber(sipId)} : {}
    const data = await this.request('sip/redirection', params)
    return data.info as responses.Redirection[]
  }

  /**
   * Return information about the user's phone numbers.
   */
  public async getDirectNumbers(): Promise<responses.DirectNumber[]> {
    const data = await this.request('direct_numbers')
    return data.info as responses.DirectNumber[]
  }

  /**
   * Return online status of the PBX extension number.
   */
  public async getPbxInternal(): Promise<responses.PbxInternal> {
    const data = await this.request('pbx/internal')
    return data as responses.PbxInternal
  }

  /**
   * Return online status of the PBX extension number.
   * @param pbxId
   */
  public async getPbxStatus(pbxId: string): Promise<responses.PbxStatus> {
    const data = await this.request(`pbx/internal/${this.filterNumber(pbxId)}/status`)
    return data as responses.PbxStatus
  }

  /**
   * Return information about the PBX extension number.
   * @param pbxId
   */
  public async getPbxInfo(pbxId: string): Promise<responses.PbxInfo> {
    const data = await this.request(`pbx/internal/${this.filterNumber(pbxId)}/info`)
    return data as responses.PbxInfo
  }

  /**
   * Return call recording file request.
   * @param callId Unique call ID, it is specified in the name of the file with the call recording (unique for every recording)
   * @param pbxCallId Permanent ID of the external call to the PBX
   * @param lifetime The link's lifetime in seconds (minimum - 180, maximum - 5184000, default - 1800)
   */
  public async getPbxRecord(callId: string, pbxCallId: string, lifetime?: number): Promise<responses.PbxRecordRequest> {
    const params: {call_id?: string; pbx_call_id?: string; lifetime?: number} = {}
    if (callId) {
      params.call_id = callId
    }
    if (pbxCallId) {
      params.pbx_call_id = pbxCallId
    }
    if (!params.call_id && !params.pbx_call_id) {
      throw new ApiException('callId or pbxCallId required')
    }
    if (lifetime) {
      params.lifetime = lifetime
    }
    const data = await this.request('pbx/record/request', params)
    return data as responses.PbxRecordRequest
  }

  /**
   * Return call forwarding parameters on the PBX extension number.
   * @param pbxNumber PBX extension number
   */
  public async getPbxRedirection(pbxNumber: string): Promise<responses.PbxRedirection> {
    const data = await this.request('pbx/redirection', {pbx_number: this.filterNumber(pbxNumber)})
    return data as responses.PbxRedirection
  }

  /**
   * Return overall statistics.
   * Maximum period of getting statistics is - 1 month. If the limit in the request is exceeded, the time period
   * automatically decreases to 30 days. If the start date is not specified, the start of the current month will be
   * selected. If the end date is not specified, the current date and time will be selected.
   * @param start The start date of the statistics display (format - y-m-d H:i:s)
   * @param end The end date of the statistics display (format - y-m-d H:i:s)
   * @param sip Filter based on a specific SIP number
   * @param costOnly Display only the amount of funds spent during a specific period
   * @param type Request type: overall (is not specified in the request), toll and ru495
   * @param skip Number of lines to be skipped in the sample. The output begins from skip +1 line.
   * @param limit The limit on the number of input lines (the maximum value is 1000, the default value is 1000)
   */
  public async getStatistics(
    start?: string,
    end?: string,
    sip?: string,
    costOnly?: boolean,
    type?: string,
    skip?: number,
    limit?: number
  ): Promise<responses.Statistics> {
    const params = this.filterParams({start, end, sip: sip ? this.filterNumber(sip) : undefined, cost_only: costOnly, type, skip, limit})
    const data = await this.request('statistics', params)
    return data as responses.Statistics
  }

  /**
   * Return PBX statistics.
   * @see Api.getStatistics For $start, $end, $skip, $limit parameters details.
   * @param start
   * @param end
   * @param newFormat Format of the statistics result.
   * @param callType 'in' for incoming calls, 'out' for outgoing, null for both
   * @param skip
   * @param limit
   */
  public async getPbxStatistics(
    start?: string,
    end?: string,
    newFormat: boolean = true,
    callType?: 'in' | 'out',
    skip?: number,
    limit?: number
  ): Promise<responses.PbxStatistics> {
    const params = this.filterParams({start, end, version: newFormat ? 2 : 1, skip, limit, call_type: callType})
    const data = await this.request('statistics/pbx', params)
    return data as responses.PbxStatistics
  }

  /**
   * Return CallBack widget statistics.
   * @see Api.getStatistics For $start and $end parameters details.
   * @param start
   * @param end
   * @param widget_id
   */
  public async getCallbackWidgetStatistics(start?: string, end?: string, widget_id?: string): Promise<responses.PbxStatistics> {
    const params = this.filterParams({start, end, widget_id})
    const data = await this.request('statistics/callback_widget', params)
    return data as responses.PbxStatistics
  }

  /**
   * Return overall incoming calls statistics.
   * Maximum period of getting statistics is - 1 month. If the limit in the request is exceeded, the time period
   * automatically decreases to 30 days. If the start date is not specified, the start of the current month will be
   * selected. If the end date is not specified, the current date and time will be selected.
   * @param start The start date of the statistics display (format - y-m-d H:i:s)
   * @param end The end date of the statistics display (format - y-m-d H:i:s)
   * @param sip Filter based on a specific SIP number
   * @param skip Number of lines to be skipped in the sample. The output begins from skip +1 line.
   * @param limit The limit on the number of input lines (the maximum value is 1000, the default value is 1000)
   */
  public async getIncomingCallStatistics(start?: string, end?: string, sip?: string, skip?: number, limit?: number): Promise<responses.IncomingCallsStatistics> {
    const params = this.filterParams({start, end, sip: sip ? this.filterNumber(sip) : undefined, skip, limit})
    const data = await this.request('statistics/incoming-calls', params)
    return data as responses.IncomingCallsStatistics
  }

  /**
   * Changing of the CallerID.
   * @param sipId The SIP ID, which needs the CallerID to be changed;
   * @param number The new (changed) phone number, in international format (from the list of confirmed or purchased phone numbers).
   */
  public async setSipCallerId(sipId: string, number: string): Promise<responses.SipCaller> {
    const params = {id: this.filterNumber(sipId), number: this.filterNumber(number)}
    const data = await this.request('sip/callerid', params, 'put')
    return data as responses.SipCaller
  }

  /**
   * Call forwarding switch on/off based on the SIP number.
   * @param sipId
   * @param statusOn True for 'on' and false for 'off' status.
   */
  public async setSipRedirectionStatus(sipId: string, statusOn: boolean): Promise<responses.SipRedirectionStatus> {
    const params = {id: this.filterNumber(sipId), status: statusOn ? 'on' : 'off'}
    const data = await this.request('sip/redirection', params, 'put')
    return data as responses.SipRedirectionStatus
  }

  /**
   * Changing of the call forwarding parameters.
   * @param sipId
   * @param number phone number
   */
  public async setSipRedirectionNumber(sipId: string, number: string): Promise<responses.Redirection> {
    const params = {id: this.filterNumber(sipId), type: 'phone', number: this.filterNumber(number)}
    const data = await this.request('sip/redirection', params, 'put')
    return data as responses.Redirection
  }

  /**
   * Enabling of the call recording on the PBX extension number.
   * @param sipId
   * @param status One of the values: "on" - switch on, "off" - switch off, "on_email" - enable the option to send the recordings to the email address only, "off_email" - disable the option to send the recordings to the email address only, "on_store" - enable the option to save the recordings to the cloud, "off_store" - disable the option to save the recordings to the cloud.
   * @param email (optional) change the email address, where the call recordings will be sent. You can specify up to 3 email addresses, separated by comma.
   * @param speechRecognition (optional) change the speech recognition settings: "all" - recognize all, "optional" - recognize selectively in statistics, "off" - disable.
   */
  public async setPbxRecording(sipId: string, status: 'on' | 'off' | 'on_email' | 'off_email' | 'on_store' | 'off_store', email?: string, speechRecognition?: 'all' | 'optional' | 'off'): Promise<responses.PbxRecording> {
    const params: {id: string; status: string; email?: string; speech_recognition?: string} = {
      id: this.filterNumber(sipId),
      status,
    }
    if (email) {
      params.email = email
    }
    if (speechRecognition && status !== 'off' && status !== 'off_store') {
      params.speech_recognition = speechRecognition
    }
    const data = await this.request('pbx/internal/recording', params, 'put')
    return data as responses.PbxRecording
  }

  /**
   * Sending the SMS messages.
   * @param to Phone number(s), where to send the SMS message (array of numbers can be specified);
   * @param message Message (standard text limit applies; the text will be separated into several SMS messages, if the limit is exceeded);
   * @param callerId Phone number, from which the SMS messages is sent (can be sent only from list of user's confirmed phone numbers).
   */
  public async sendSms(to: string | string[], message: string, callerId?: string): Promise<responses.Sms> {
    const numbers = Array.isArray(to) ? to.map(n => this.filterNumber(n)) : [this.filterNumber(to)]
    const params: {number: string; message: string; caller_id?: string} = {
      number: numbers.join(','),
      message,
    }
    if (callerId) {
      params.caller_id = callerId
    }
    const data = await this.request('sms/send', params, 'post')
    return data as responses.Sms
  }

  /**
   * Number lookup for one phone number.
   * @param number Phone number.
   */
  public async numberLookup(number: string): Promise<responses.NumberLookup> {
    const data = await this.request('info/number_lookup', {numbers: this.filterNumber(number)}, 'post')
    return data.info as responses.NumberLookup
  }

  /**
   * Number lookup for multiple phone numbers.
   * @param numbers Phone number.
   */
  public async numberLookupMultiple(numbers: string[]): Promise<void> {
    const filteredNumbers = numbers.map(n => this.filterNumber(n)).filter(Boolean)
    await this.request('info/number_lookup', {numbers: filteredNumbers}, 'post')
  }

  /**
   * Turn off call forwarding parameters on the PBX extension number.
   * @param pbxNumber PBX extension number.
   */
  public async setPbxRedirectionOff(pbxNumber: string): Promise<responses.PbxRedirection> {
    const params = {pbx_number: this.filterNumber(pbxNumber), status: 'off'}
    const data = await this.request('pbx/redirection', params, 'post')
    return data as responses.PbxRedirection
  }

  /**
   * Turn on and setup call forwarding to phone on the PBX extension number.
   * @param pbxNumber PBX extension number.
   * @param destination Phone number.
   * @param always Always forward calls or only if there is no answer.
   * @param setCallerId Setting up your CallerID during the call forwarding.
   */
  public async setPbxPhoneRedirection(pbxNumber: string, destination: string, always: boolean, setCallerId: boolean): Promise<responses.PbxRedirection> {
    const params = {
      pbx_number: this.filterNumber(pbxNumber),
      type: 'phone',
      condition: always ? 'always' : 'noanswer',
      destination: this.filterNumber(destination),
      set_caller_id: setCallerId ? 'on' : 'off',
    }
    const data = await this.request('pbx/redirection', params, 'post')
    return data as responses.PbxRedirection
  }

  /**
   * Turn on and setup call forwarding to voicemail on the PBX extension number.
   * @param pbxNumber PBX extension number.
   * @param destination Email address.
   * @param always Always forward calls or only if there is no answer.
   * @param greeting Notifications about call forwarding, possible values: 'no', 'standart', 'own'.
   * @param greetingFile Path to file with notification in mp3 format or wav below 5 MB. Specified only when greeting = own.
   */
  public async setPbxVoicemailRedirection(pbxNumber: string, destination: string, always: boolean, greeting: 'no' | 'standart' | 'own', greetingFile?: any): Promise<responses.PbxRedirection> {
    const params: any = {
      pbx_number: this.filterNumber(pbxNumber),
      type: 'voicemail',
      condition: always ? 'always' : 'noanswer',
      destination,
      voicemail_greeting: greeting,
    }
    if (greeting === 'own' && greetingFile) {
      params.greeting_file = greetingFile
    }
    const data = await this.request('pbx/redirection', params, 'post')
    return data as responses.PbxRedirection
  }

  /**
   * Start speech recognition.
   * @param callId Unique call ID, it is specified in the name of the file with the call recording (unique for every recording)
   * @param lang recognition language (not required)
   */
  public async startSpeechRecognition(callId: string, lang?: string): Promise<boolean> {
    const params: {call_id: string; lang?: string} = {call_id: callId}
    if (lang) {
      params.lang = lang
    }
    const data = await this.request('speech_recognition', params, 'put')
    return data.status === 'success'
  }

  /**
   * Obtaining recognition results.
   * @param callId Unique call ID, it is specified in the name of the file with the call recording (unique for every recording)
   * @param lang recognition language (not required)
   * @param returnWords return words or phrases
   * @param returnAlternatives return alternative results
   */
  public async getSpeechRecognitionResult(callId: string, lang?: string, returnWords: boolean = false, returnAlternatives: boolean = false): Promise<responses.SpeechRecognition> {
    const params: {call_id: string; return: string; alternatives: number; lang?: string} = {
      call_id: callId,
      return: returnWords ? 'words' : 'phrases',
      alternatives: returnAlternatives ? 1 : 0,
    }
    if (lang) {
      params.lang = lang
    }
    const data = await this.request('speech_recognition', params, 'get')
    return data as responses.SpeechRecognition
  }

  /**
   * Get a key for a webrtc widget.
   * @param sipLogin SIP login or login of PBX extension number
   */
  public async getWebrtcKey(sipLogin: string): Promise<responses.WebrtcKey> {
    const data = await this.request('webrtc/get_key', {sip: sipLogin})
    return data as responses.WebrtcKey
  }

  /**
   * Make request to api with error checking.
   * @param method
   * @param params
   * @param requestType
   * @private
   */
  private async request(method: string, params: Record<string, any> = {}, requestType: 'get' | 'post' | 'put' | 'delete' = 'get'): Promise<any> {
    const result = await this.call(`/${Api.VERSION}/${method}/`, params, requestType)
    if (result.status === 'error' || this.getHttpCode() >= 400) {
      throw new ApiException(result.message || 'Unknown error')
    }
    return result
  }

  /**
   * Filter from non-digit symbols.
   * @param number
   * @private
   */
  private filterNumber(number: string): string {
    const filtered = (number + '').replace(/\D/g, '')
    if (!filtered) {
      throw new ApiException('Wrong number format.')
    }
    return filtered
  }

  /**
   * Remove null value items from params.
   * @param params
   * @private
   */
  private filterParams(params: Record<string, any>): Record<string, any> {
    return Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
  }
}
