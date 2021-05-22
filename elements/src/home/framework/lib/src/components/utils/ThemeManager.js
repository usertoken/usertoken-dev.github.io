var createAlphaPrimaryColor = function() {
    let alphaColor = window.getComputedStyle(document.documentElement).getPropertyValue('--PrimaryColor')
    alphaColor = alphaColor.trim()
    alphaColor = alphaColor+'9C'
    document.documentElement.style.setProperty('--color_primary_alpha', alphaColor)
}
exports.createAlphaPrimaryColor = createAlphaPrimaryColor

var setAppDark = function() {
    // var meta = document.getElementById('statusBarColor')
    // meta.parentNode.removeChild(meta)
    // document.head.innerHTML += '<meta name="theme-color" content="#403E41" id="statusBarColor" />'
    document.documentElement.style.setProperty('--color_light_bg','#111111')
    document.documentElement.style.setProperty('--color_dark_text','#FFFFFF')
    document.documentElement.style.setProperty('--color_nav','#403E41')
    document.documentElement.style.setProperty('--color_light_grey','#444444')
    document.documentElement.style.setProperty('--color_light_grey_alpha','#444444D1')
    document.documentElement.style.setProperty('--color_link_bg_hover','#555555')
    document.documentElement.style.setProperty('--color_link_bg_active','#222222')
    document.documentElement.style.setProperty('--color_button','#555555')
    document.documentElement.style.setProperty('--color_button_hover','#999999')
    document.documentElement.style.setProperty('--color_button_active','#222222')
    document.documentElement.style.setProperty('--color_button_active_border','#EEEEEE')
    document.documentElement.style.setProperty('--color_primary_light','#FFFFFF')
    document.documentElement.style.setProperty('--color_primary_dark','#403E41')
    return ''
}
exports.setAppDark = setAppDark

var setAppLight = function() {
    // var meta = document.getElementById('statusBarColor')
    // meta.parentNode.removeChild(meta)
    // document.head.innerHTML += '<meta name="theme-color" content="#EEE" id="statusBarColor" />'
    document.documentElement.style.setProperty('--color_light_bg','')
    document.documentElement.style.setProperty('--color_dark_text','')
    document.documentElement.style.setProperty('--color_nav','')
    document.documentElement.style.setProperty('--color_light_grey','')
    document.documentElement.style.setProperty('--color_light_grey_alpha','')
    document.documentElement.style.setProperty('--color_link_bg_hover','')
    document.documentElement.style.setProperty('--color_link_bg_active','')
    document.documentElement.style.setProperty('--color_button','')
    document.documentElement.style.setProperty('--color_button_hover','')
    document.documentElement.style.setProperty('--color_button_active','')
    document.documentElement.style.setProperty('--color_button_active_border','')
    document.documentElement.style.setProperty('--color_primary_light','')
    document.documentElement.style.setProperty('--color_primary_dark','')
    return ''
}
exports.setAppLight = setAppLight