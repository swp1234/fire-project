'use strict';

const AD_HOST_RE = /(?:googlesyndication\.com|doubleclick\.net|googleadservices\.com|adservice\.google\.|fundingchoicesmessages\.google\.com)/i;

async function blockExternalAds(target) {
  if (!target || typeof target.route !== 'function') {
    return;
  }
  await target.route(
    (url) => AD_HOST_RE.test(typeof url === 'string' ? url : url.href),
    (route) => route.abort()
  );
}

module.exports = {
  AD_HOST_RE,
  blockExternalAds,
};
