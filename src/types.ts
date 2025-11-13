export interface Balance {
  balance: number
  currency: string
}

export interface Price {
  prefix: string
  description: string
  price: number
  currency: string
}

export interface Timezone {
  unixtime: number
  datetime: string
  timezone: string
}

export interface Tariff {
  /** User's current price plan ID. */
  tariff_id: number
  /** The name of the user's current price plan. */
  tariff_name: string
  /** The current price plan is active or inactive. */
  is_active: boolean
  /** The cost of the price plan. */
  cost: number
  /** The price plan currency. */
  currency: string
  /** The amount of price plan seconds used. */
  used_seconds: number
  /** The amount of price plan seconds used on calls to mobiles. */
  used_seconds_mobile: number
  /** The amount of price plan seconds used on calls to landlines. */
  used_seconds_fix: number
  /** The user's price plan ID for the next time period. */
  tariff_id_for_next_period: number
  /** The name of the user's price plan for the next time period. */
  tariff_for_next_period: string
}

export interface RequestCallback {
  from: string
  to: string
  time: number
}

export interface Sip {
  id: string
  display_name: string
  lines: number
}

export interface SipStatus {
  sip: string
  is_online: 'true' | 'false'
}

export interface Redirection {
  sip_id: string
  status: 'on' | 'off'
  condition: 'always' | 'unavailable'
  destination: 'phone' | 'pbx'
  destination_value: string
}

export interface DirectNumber {
  /** the user's purchased virtual phone number */
  number: string
  /** the phone number status */
  status: string
  /** country (for common and revenue) */
  country: string
  /** description: city or type (for common and revenue) */
  description: string
  /** the virtual phone number "name" (set by the user) */
  number_name: string | null
  /** the SIP connected to the phone number */
  sip: number
  /** the "name" of the SIP connected to the phone number */
  sip_name: string | null
  /** the date of purchase */
  start_date: string
  /** the end date of the user's payment period */
  stop_date: string
  /** the phone number cost (for common) */
  monthly_fee: number
  /** the currency of the phone number cost (for common) */
  currency: string
  /** the number of lines on the phone number (for common) */
  channels: number
  /** the total duration of incoming calls for the current month (for revenue) */
  minutes: number
  /** the automatic phone number extension is enabled or disabled (for common, revenue, rufree) */
  autorenew: 'true' | 'false'
  /** the phone number is being tested or not. */
  is_on_test: 'true' | 'false'
  /** phone number type: common (virtual number), inum (free international number), rufree (free Moscow number), revenue (free Moscow 495 number). */
  type: string
}

export interface PbxInternal {
  pbx_id: number
  numbers: number[]
}

export interface PbxStatus {
  pbx_id: number
  number: number
  is_online: 'true' | 'false'
}

export interface PbxInfo {
  /** PBX ID */
  pbx_id: number
  /** PBX extension number */
  number: number
  /** display name */
  name: string
  /** CallerID */
  caller_id: string
  /** change the CallerID from the app (true|false) */
  caller_id_app_change: 'true' | 'false'
  /** CallerID by direction (true|false) */
  caller_id_by_direction: 'true' | 'false'
  /** number of lines */
  lines: string
  /** ip access restriction (false if omitted) */
  ip_restriction: string | false
  /** record conversations to the cloud (Without recognition|For manual recognition|For automatic speech recognition|false) */
  record_store:
    | 'Without recognition'
    | 'For manual recognition'
    | 'For automatic speech recognition'
    | 'false'
  /** email for sending conversation recordings (false if not enabled) */
  record_email: string | false
}

export interface PbxRecordRequest {
  link: string
  links: string[]
  lifetime_till: string
}

export interface PbxRedirection {
  current_status: 'on' | 'off'
  pbx_id: number
  pbx_name: string
  type: 'phone' | 'voicemail' | 'menu' | 'sip' | 'sip_uri'
  destination: string
  condition: 'always' | 'noanswer'
  voicemail_greeting?: 'no' | 'standart' | 'own'
  greeting_file?: string
  set_caller_id?: string
}

export interface Stat {
  /** call ID */
  id: string
  /** SIP-number */
  sip: string
  /** the call start time */
  callstart: string
  /** description of call destination */
  description: string
  /**
   * the call status:
   * 'answered' – conversation,
   * 'busy' – busy,
   * 'cancel' - cancelled,
   * 'no answer' - no answer,
   * 'failed' - failed,
   * 'no money' - no funds, the limit has been exceeded,
   * 'unallocated number' - the phone number does not exist,
   * 'no limit' - the limit has been exceeded,
   * 'no day limit' - the day limit has been exceeded,
   * 'line limit' - the line limit has been exceeded,
   * 'no money, no limit' - the limit has been exceeded
   */
  disposition:
    | 'answered'
    | 'busy'
    | 'cancel'
    | 'no answer'
    | 'failed'
    | 'no money'
    | 'unallocated number'
    | 'no limit'
    | 'no day limit'
    | 'line limit'
    | 'no money, no limit'
  /** the amount of seconds */
  billseconds: number
  /** the cost per minute of calls to this destination */
  cost: number
  /** the cost of the paid minutes */
  billcost: number
  /** the cost currency */
  currency: string
  /** which number was used to make a call */
  from: string
  /** the phone number that was called */
  to: string
}

export interface Statistics {
  /** start date of the statistics display */
  start: string
  /** end date of the statistics display */
  end: string
  stats: Stat[]
}

export interface PbxStat {
  /** SIP-number */
  sip: string
  /** the call start time */
  callstart: string
  /** CallerID */
  clid: string
  /** the call destination */
  destination: string
  /**
   * the call status:
   * 'answered' – conversation,
   * 'busy' – busy,
   * 'cancel' - cancelled,
   * 'no answer' - no answer,
   * 'failed' - failed,
   * 'no money' - no funds, the limit has been exceeded,
   * 'unallocated number' - the phone number does not exist,
   * 'no limit' - the limit has been exceeded,
   * 'no day limit' - the day limit has been exceeded,
   * 'line limit' - the line limit has been exceeded,
   * 'no money, no limit' - the limit has been exceeded
   */
  disposition:
    | 'answered'
    | 'busy'
    | 'cancel'
    | 'no answer'
    | 'failed'
    | 'no money'
    | 'unallocated number'
    | 'no limit'
    | 'no day limit'
    | 'line limit'
    | 'no money, no limit'
  /** the amount of seconds */
  seconds: number
  /** recorded or no conversations */
  is_recorded: boolean
  /** permanent ID of the external call to the PBX (does not alter with the scenario changes, voice menu, etc., it is displayed in the statistics and notifications) */
  pbx_call_id: string
}

export interface PbxStatistics {
  /** start date of the statistics display */
  start: string
  /** end date of the statistics display */
  end: string
  /** format of the statistics result (2 - new, 1 - old) */
  version: number
  stats: PbxStat[]
}

export interface IncomingCallsStatistics {
  /** start date of the statistics display */
  start: string
  /** end date of the statistics display */
  end: string
  stats: Stat[]
}

export interface SipCaller {
  sip: string
  new_caller_id: string
}

export interface SipRedirectionStatus {
  sip: string
  current_status: 'on' | 'off'
}

export interface SipRedirection {
  sip: string
  destination: string
}

export interface PbxRecording {
  internal_number: string
  recording: 'on' | 'off' | 'on_email' | 'off_email' | 'on_store' | 'off_store'
  email: string
  speech_recognition: 'all' | 'optional' | 'off'
}

export interface Sms {
  messages: string[]
  cost: number
  currency: string
}

export interface NumberLookup {
  mcc: string
  mnc: string
  mccName: string
  mncName: string
  ported: boolean
  roaming: boolean
  errorDescription: string
  status: string
}

export interface Phrase {
  channel: number
  startTime: number
  endTime: number
  phrase: string
}

export interface Word {
  channel: number
  startTime: number
  endTime: number
  word: string
  confidence: number
}

export interface SpeechRecognition {
  lang: string
  recognitionStatus: string
  otherLangs: string[]
  phrases: Phrase[]
  words: Word[]
}

export interface WebrtcKey {
  key: string
}

export interface NotifyStart {
  event: 'NOTIFY_START'
  call_start: string
  pbx_call_id: string
  caller_id: string
  called_did: string
}

export interface NotifyInternal {
  event: 'NOTIFY_INTERNAL'
  call_start: string
  pbx_call_id: string
  caller_id: string
  called_did: string
  internal: string
}

export interface NotifyAnswer {
  event: 'NOTIFY_ANSWER'
  caller_id: string
  destination: string
  call_start: string
  pbx_call_id: string
  internal: string
}

export interface NotifyEnd {
  event: 'NOTIFY_END'
  call_start: string
  pbx_call_id: string
  caller_id: string
  called_did: string
  internal: string
  duration: string
  disposition: string
  status_code: string
  is_recorded: '0' | '1'
  call_id_with_rec: string
}

export interface NotifyOutStart {
  event: 'NOTIFY_OUT_START'
  call_start: string
  pbx_call_id: string
  internal: string
  destination: string
}

export interface NotifyOutEnd {
  event: 'NOTIFY_OUT_END'
  call_start: string
  pbx_call_id: string
  caller_id: string
  destination: string
  internal: string
  duration: string
  disposition: string
  status_code: string
  is_recorded: '0' | '1'
  call_id_with_rec: string
}

export interface NotifyRecord {
  event: 'NOTIFY_RECORD'
  call_id_with_rec: string
  pbx_call_id: string
}

export interface NotifyIvr {
  event: 'NOTIFY_IVR'
  call_start: string
  pbx_call_id: string
  caller_id: string
  called_did: string
  ivr_saydigits: any
  ivr_saynumber: any
  wait_dtmf?: WaitDtmf | null
}

export interface WaitDtmf {
  name: string
  digits: string
  default_behaviour: string
}
