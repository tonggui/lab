function hasClass (elem, className) {
  return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ')
}

function toggleClass (elem, className) {
  var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' '
  if (hasClass(elem, className)) {
    while (newClass.indexOf(' ' + className + ' ') >= 0) {
      newClass = newClass.replace(' ' + className + ' ', ' ')
    }
    elem.className = newClass.replace(/^\s+|\s+$/g, '')
  } else {
    elem.className += ' ' + className
  }
}

function innerMenu (menuStr) {
  var dom = document.createElement('div')
  dom.innerHTML = `<a href="#qb-menu" id="qb-toggle"><span></span></a>
                      <div id="qb-menu">
                          <ul>
                              ${menuStr}
                          </ul>
                      </div>`
  var style = document.createElement('style')
  style.innerHTML = `
      .qb-menu-box {
          position: fixed;
          top: 0;
          left: 0;
      }
  
      #qb-toggle {
          display: block;
          width: 44px;
          height: 40px;
          margin: 10px 0 0 10px;
          padding: 8px;
          padding-top: 17px;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 2px;
          box-shadow: 1px 2px 6px -4px #000;
      }
      
      #qb-toggle span:after,
      #qb-toggle span:before {
          content: "";
          position: absolute;
          left: 0;
          top: -9px;
      }
      #qb-toggle span:after{
          top: 9px;
      }
      #qb-toggle span {
          position: relative;
          display: block;
      }
      
      #qb-toggle span,
      #qb-toggle span:after,
      #qb-toggle span:before {
          width: 100%;
          height: 5px;
          background-color: #888;
          transition: all 0.3s;
          backface-visibility: hidden;
          border-radius: 2px;
      }
  
      #qb-toggle.on span {
          background-color: transparent;
      }
      #qb-toggle.on span:before {
          transform: rotate(45deg) translate(5px, 5px);
      }
      #qb-toggle.on span:after {
          transform: rotate(-45deg) translate(7px, -8px);
      }
      #qb-toggle.on + #qb-menu {
          left: 0px;
          visibility: visible;
      }
      
      #qb-menu {
          position: relative;
          top: 10px;
          color: #999;
          width: 120px;
          padding: 10px;
          margin: auto;
          text-align: center;
          border-radius: 4px;
          background: white;
          box-shadow: 0px 1px 8px -4px #000;
          /* just for this demo */
          left: -120px;
          visibility: hidden;
          transition: all .4s;
      }`
  dom.className = 'qb-menu-box'

  document.head.appendChild(style)
  document.body.appendChild(dom)

  var theToggle = document.getElementById('qb-toggle')
  theToggle.onclick = function () {
    toggleClass(this, 'on')
    return false
  }
}

function checkHost () {
  var host = window.location.host
  if (host.indexOf('qb.waimai') !== -1 || host.indexOf('queenbee') !== -1 || host.indexOf('localhost') !== -1) {
    return true
  }
  return false
}

function appendMenu () {
  if (!checkHost()) return

  var configUrl = 'http://portal-portm.sankuai.com/shangou/sfe/qb-product-menu.json'
  var ajax = new XMLHttpRequest()
  ajax.open('get', configUrl)
  ajax.send()
  ajax.onreadystatechange = function () {
    if (ajax.readyState === 4 && ajax.status === 200) {
      var data = JSON.parse(ajax.responseText)
      var menus = (data && data.data.menus) || []
      for (var i = 0; i < menus.length; i++) {
        var menuItem = menus[i]
        if (menuItem && menuItem.menuName === '商品管理') {
          var menuStr = ''
          menuItem.subMenus && menuItem.subMenus.forEach(function (item, index) {
            menuStr += `<li><a href="${item.url}${window.location.search}">${item.subMenuName}</a></li>`
          })

          innerMenu(menuStr)
          break
        }
      }
    }
  }
}

export default appendMenu
