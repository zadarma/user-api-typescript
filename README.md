# Zadarma API - TypeScript Library

An official TypeScript library for working with the Zadarma API. It allows you to work with all API methods (including VoIP, PBX, CallBack etc).

## Requirements

- Node.js >= 18.0.0
- Bun >= 1.0.0

## Installation

You can install the library using `npm`, `pnpm`, `yarn`, or `bun`:

```sh
npm install zadarma-api
pnpm add zadarma-api
yarn add zadarma-api
bun add zadarma-api
```

## How to use?

An official documentation on Zadarma API is [here](https://zadarma.com/support/api/).

You can find your API keys in your [personal account](https://my.zadarma.com/api/).

The library provides two main classes: `Api` and `Client`.
`Api` offers convenient wrappers for commonly used endpoints,
while `Client` provides a generic `call()` method to access any API method.

### Examples

Here's a simple example of how to get the status of a SIP number using the `Api` class:

```ts
import {Api} from 'zadarma-api'

const api = new Api('YOUR_KEY', 'YOUR_SECRET')

const result = await api.getSipStatus('YOUR_SIP_ID')
console.log(result)
```

The same example using the universal `Client` class:

```ts
import {Client} from 'zadarma-api'

const client = new Client('YOUR_KEY', 'YOUR_SECRET')

const result = await client.call('/v1/sip/YOUR_SIP_ID/status/')
console.log(result)
```

Error handling:

```ts
import {ApiException} from 'zadarma-api'

try {
  const result = await api.getSipStatus('YOUR_SIP_ID')
} catch (error) {
  if (error instanceof ApiException) {
    console.error('API Error: ', error.message)
  } else {
    console.error('An unexpected error occurred: ', error)
  }
}
```

## License

This library is licensed under the [MIT License](LICENSE.md).
