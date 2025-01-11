const permissionsBannerElement = document.getElementById('permissions-banner');
const permissionsButton = document.getElementById('grant-host-permission');
const updatePermissionsBannerVisibility = hasHostPermission => {
  permissionsBannerElement.hidden = hasHostPermission;
};
permissionsButton.addEventListener('click', () => {
  browser.permissions
    .request({ origins: ['*://www.tumblr.com/*'] })
    .then(updatePermissionsBannerVisibility);
});
browser.permissions
  .contains({ origins: ['*://www.tumblr.com/*'] })
  .then(updatePermissionsBannerVisibility);
