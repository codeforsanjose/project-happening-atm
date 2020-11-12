module.exports = (logger, dbClient, twilioClient) => {
  const module = {}
  const notifySubscribers = (messageBody, subscriptionQueryResponse) => {
    // Here we'll populate phone number and email maps to store subscription data.
    // Users can be subscribed to multiple items that have identical "order numbers".
    // This means that users can be subscribed to items that are scheduled at the same time.
    // Rather than having individual texts for every subscription, we should intelligently include
    // simultaneously scheduled subscription data in a single text message notification.
    // We'll do this by associating subscription data array values to contact keys in maps.
    const phoneNumberMap = new Map()
    const emailMap = new Map()
    const subscriptions = subscriptionQueryResponse.rows
    subscriptions.forEach(sub => {
      const phoneNumber = sub.phone_number
      const email = sub.phone_number.email_address
      if (phoneNumber !== '') {
        if (phoneNumberMap.has(phoneNumber)) {
          if (!phoneNumberMap.get(phoneNumber).includes(sub)) {
            phoneNumberMap.get(phoneNumber).push(sub)
          }
        } else {
          phoneNumberMap.set(phoneNumber, [sub])
        }
      }
      if (email !== '') {
        if (emailMap.has(email)) {
          if (!emailMap.get(email).includes(sub)) {
            emailMap.get(email).push(sub)
          }
        } else {
          emailMap.set(sub.email, [sub])
        }
      }
    })

    const getTitlesArray = async subscriptionArray => {
      const titles = []
      for (let i = 0; i < subscriptionArray.length; i += 1) {
        const sub = subscriptionArray[i]
        if (sub.meeting_item_id !== 0) {
          const res = await dbClient.getMeetingItem(sub.meeting_item_id)
          const item = res.rows[0]
          titles.push(`"${item.title_loc_key}"`)
        } else {
          const res = await dbClient.getMeeting(sub.meeting_id)
          const meeting = res.rows[0]
          titles.push(`"${meeting.meeting_type}"`)
        }
      }
      return titles
    }

    // Gather each phone number's subscription data for their text message notification
    ;[...phoneNumberMap.keys()].forEach(async number => {
      const associatedSubscriptionArray = phoneNumberMap.get(number)
      const titles = await getTitlesArray(associatedSubscriptionArray)
      const updateMessageBody = messageBody + titles
      twilioClient.sendTextMessage(number, updateMessageBody)
      // TODO: To avoid API rate limit issues, it might be a good idea to
      // implement some kind of sleep logic here
    })
  }

  module.notifyItemSubscribers = async (id, messageBody) => {
    logger.info('Notifying item subscribers')
    const res = await dbClient.getSubscriptionsByMeetingItemID(id)
    notifySubscribers(messageBody, res)
  }

  module.notifyMeetingSubscribers = async (id, messageBody) => {
    logger.info('Notifying meeting subscribers')
    const res = await dbClient.getSubscriptionsByMeetingID(id)
    notifySubscribers(messageBody, res)
  }

  module.notifyNextItemSubscribers = async (meetingItem, messageBody) => {
    logger.info('Notifying next item subscribers')
    const meetingID = meetingItem.meeting_id
    const currentOrderNumber = meetingItem.order_number

    const res = await dbClient.getMeetingItemsByMeetingID(meetingID)
    const meetingItems = res.rows

    const nextItemsids = []
    meetingItems.forEach(item => {
      if (item.order_number === currentOrderNumber + 1) {
        nextItemsids.push(item.id)
      }
    })

    const subscriptionsRes = await dbClient.getSubscriptionsByMeetingIDList(
      nextItemsids,
    )
    notifySubscribers(messageBody, subscriptionsRes)
  }

  return module
}
