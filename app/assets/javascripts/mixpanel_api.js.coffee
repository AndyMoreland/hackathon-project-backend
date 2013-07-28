class MixpanelRequest
  constructor: (url, newParams, callback) ->
    params = _.clone(newParams)
    @apiKey = "5adfdf2d43efa8e8b858b4899b352505"
    @apiSecret = "c1906196873ae29c5b7e6dc1a14debdf"
    params["api_key"] = @apiKey
    params["expire"] = @expireTime()
    (params["event"] = '["' + params["event"] + '"]') if params["event"]
    params["sig"] = @computeSig(params)
    $.getJSON(url+"?callback=?", params, callback).fail () -> console.log(arguments)

  expireTime: =>
    date = new Date()
    date.setMinutes(date.getMinutes() + 1)

  computeSig: (params) =>
    sorted_keys = _(_.keys(params)).sortBy(_.identity)
    string = ""
    _(sorted_keys).each (k) =>
      string += (k + "=" + params[k])
    string += @apiSecret
    console.log string
    hex_md5(string)


window.MixpanelRequest = MixpanelRequest
