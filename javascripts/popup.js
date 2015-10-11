;(function(win, doc) {
  var form = doc.forms.popupForm;
  var formElements = form.elements;
  var formElementLength = formElements.length;
  var ls = localStorage;

  var restore = function() {
    for (var i = 0; i < formElementLength; i++) {
      var thisElem = formElements[i];

      if (ls[thisElem.name] === 'true') {
        thisElem.checked = true;
        thisElem.parentNode.classList.add('checked');
      }
    }
  };

  var timeout;
  var showMessage = function(message) {
    var messageBox = doc.getElementById('message');
    messageBox.innerText = message;
    messageBox.style.display = 'block';

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(function() {
      messageBox.removeAttribute('style');
    }, 1000);
  };

  function postMessagenger(elem, inputElem, actionName) {
    var input = formElements[inputElem];

    elem.addEventListener('click', function() {
      if (!input.value.trim()) return;

      win.postMessage({
        action: actionName,
        content: input.value,
        inputName: input.id
      }, '*');
    }, false);
  }

  function pressEnter(selector) {
    var txtInputs = doc.querySelectorAll(selector);
    var press = function(e) {
      if (e.keyCode == 13) {
        this.nextElementSibling.click();
      }
    };

    for (var i = 0, len = txtInputs.length; i < len; i++) {
      txtInputs[i].addEventListener('keyup', press, false);
    }
  }

  function checkboxChange() {
    var checkboxes = doc.querySelectorAll('[type="checkbox"]');

    var changer = function() {
      ls[this.name] = this.checked;
      this.parentNode.classList.toggle('checked');

      showMessage('저장되었습니다.');
    };

    for (var i = 0, len = checkboxes.length; i < len; i++) {
      checkboxes[i].addEventListener('change', changer, false);
    }
  }

  doc.addEventListener('DOMContentLoaded', function() {
    restore();

    postMessagenger(formElements.blockBtn, 'blockInput', 'titleBlockDelivery');
    postMessagenger(formElements.blockUserBtn, 'blockUserInput', 'userBlockDelivery');

    pressEnter('.keywordInput');
    checkboxChange();

    chrome.management.get(chrome.i18n.getMessage('@@extension_id'), function(result) {
      doc.getElementById('version').innerText = 'ver. ' + result.version;
    });
  }, false);

  win.addEventListener('message', function(e) {
    if (win != e.source) return;

    switch(e.data.action) {
      case 'titleBlockDelivery':
      case 'userBlockDelivery':
        chrome.extension.sendMessage(
          {
            action: e.data.action,
            data: e.data
          },
          function(response) {
            formElements[e.data.inputName].value = '';

            if(response.result) {
              showMessage('저장되었습니다.');
            } else {
              showMessage(response.message);
            }
          }
        );
      break;
    }
  }, false);
})(window, document);
