# Todo

Decide on explicit or implicit many-many
Implicit (faster, more ergonomic)
Explicit (doesn't require db cleanup externally)

## Priority Most User Requested

- [ ] Make creating a system more clear (dropdown starts down)
- [ ] Find out why Steam API doesn't return some free games (1808800 Duck
      Simulator 2 for example)
- [ ] Add tags/icons for controller support
- [ ] Add tags for aspect ration support
- [x] Add options to leave fps in performance review
- [ ] Add options to leave controller support info

## Priority High

- [ ] Make performance post form fields reset without flashing
- [ ] Make Like/System/Edit buttons smaller
- [ ] Fix loading performance posts twice in $steamAppId and $steamAppId/posts,
      just pull data with useMatches() or only pull ratings from server
- [ ] Add tests!
- [x] Add controller review option
- [x] Add ability to tag performance post (Native, Rosetta 2, CrossOver 19 - 22,
      Parallels 16 - 18)
- [ ] Add clarifier for rating meaning (tooltip?)
- [x] Centralize form validation (systemName etc.)
- [x] Add contact information (twitter, discord, reddit)
- [x] Add not affiliated with Steam information
- [ ] Figure out how to reset Select Menus on forms when form resets
- [x] Fill footer
- [x] Add trending individual posts element to homepage
- [x] Make background color elements curvy
- [ ] Restyle layout for performance posts

## Priority Medium

- [ ] Update /lib/css folder name to /lib/css-utils
- [ ] Name change interfaces folder to types
- [x] Make animated underline animate
- [ ] Make edit post redirect to originating page
- [ ] Add profile fly in menu for mobile
- [x] Fix game controller change to none when editing
- [x] Fix title name on Profile liked-posts
- [x] Create re-route logic for user not logged in trying to access
      /profile/routes
- [ ] Fix scroll to on anchor links to post idx
- [x] Fix focus-visible (show-ring) on MultiSelect
- [ ] Fix ring spacing on all elements with show-ring
- [x] Refactor Icons
<!-- - [ ] Look at using .client.ts(x) extension for colorMode, instead of using
      suspense and lazy loading. -->
- [x] Make Regex for system information more robust
- [ ] Spruce up forms to be more visually consistent
- [x] Add a sync button to profile so users can sync their game library at
      anytime, not just on initial login
- [ ] Fonts
