let optionKeys = ['preferred_thumbnail_file', 'video_title_format'];

chrome.storage.sync.get(optionKeys, function (storage) {
    optionKeys.forEach(function (optionKey) {
        document.getElementsByName(optionKey).forEach(function (item) {

            if (storage[optionKey] === item.value) {
                item.checked = true;
            }

            item.addEventListener('input', function () {
                chrome.storage.sync.set({[optionKey]: item.value});
            })
        });
    })
});

document.getElementById('whitelist_channel').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const url = new URL(tabs[0].url);

    // format: https://www.youtube.com/@channelname/...
    // match from the first '@' to the first '/' after that:
    const channelName = url.pathname.match(/@([^\/]+)/)[1];

    chrome.storage.sync.get(['whitelist'], function ({whitelist}) {
      if (!whitelist.includes(channelName)) {
        whitelist.push(channelName);
        chrome.storage.sync.set({whitelist});
      }
    });
  });
});

const textElements = document.querySelectorAll('[data-localize]');
textElements.forEach((e) => {
  const ref = e.dataset.localize;
  if (ref) {
     const translated= ref.replace(/__MSG_(\w+)__/g, (match, theGroup) => chrome.i18n.getMessage(theGroup));
    if (translated) {
      e.innerText = translated;
    }
  }
});

let donateButton = document.getElementById('donatebutton');

donateButton.onclick = function () {
    document.getElementById('settings').remove();
    donateButton.remove();
    document.getElementById('donate').style.display = 'block';
}

document.getElementById('paypallink').onclick = function () {
    chrome.tabs.create({url: 'https://paypal.me/pietervanheijningen'})
}
