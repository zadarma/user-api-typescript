import * as crypto from 'crypto'
import {
  NotifyAnswer,
  NotifyEnd,
  NotifyInternal,
  NotifyIvr,
  NotifyOutEnd,
  NotifyOutStart,
  NotifyRecord,
  NotifyStart
} from './types'

export type Notify = NotifyStart | NotifyInternal | NotifyAnswer | NotifyEnd | NotifyOutStart | NotifyOutEnd | NotifyRecord | NotifyIvr

export const EVENT_START = 'NOTIFY_START'
export const EVENT_INTERNAL = 'NOTIFY_INTERNAL'
export const EVENT_ANSWER = 'NOTIFY_ANSWER'
export const EVENT_END = 'NOTIFY_END'
export const EVENT_OUT_START = 'NOTIFY_OUT_START'
export const EVENT_OUT_END = 'NOTIFY_OUT_END'
export const EVENT_RECORD = 'NOTIFY_RECORD'
export const EVENT_IVR = 'NOTIFY_IVR'

function getSignatureString(notify: Notify): string {
  switch (notify.event) {
    case EVENT_START:     return notify.caller_id + notify.called_did + notify.call_start
    case EVENT_INTERNAL:  return notify.caller_id + notify.called_did + notify.call_start
    case EVENT_ANSWER:    return notify.caller_id + notify.destination + notify.call_start
    case EVENT_END:       return notify.caller_id + notify.called_did + notify.call_start
    case EVENT_OUT_START: return notify.internal + notify.destination + notify.call_start
    case EVENT_OUT_END:   return notify.internal + notify.destination + notify.call_start
    case EVENT_RECORD:    return notify.pbx_call_id + notify.call_id_with_rec
    case EVENT_IVR:       return notify.caller_id + notify.called_did + notify.call_start
  }
}

/**
 * Return notify object populated from postData, depending on 'event' field.
 * If cannot match event to object, return null.
 * Perform signature test, before populating data.
 * Throw SignatureException in case of signature test failure.
 * @param postData Data for model populating.
 * @param secret Your secret key from personal account.
 * @param signature Signature from headers.
 * @param eventFilter array of allowed events. If not specified, return all events. Example: [EVENT_START, EVENT_IVR]
 */
export function getWebhookEvent(postData: any, secret: string, signature?: string, eventFilter?: string[]): Notify | null {
  if (!postData || !postData.event || (eventFilter && !eventFilter.includes(postData.event))) {
    return null
  }

  const notify = postData as Notify
  const expectedSignature = crypto.createHmac('sha1', secret).update(getSignatureString(notify)).digest('base64')

  if (signature && signature !== expectedSignature) {
    return null
  }

  return notify
}
