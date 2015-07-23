# crave-venues

## Collector Site
http://crave-venues-staging.meteor.com/collector

### Notes
- Only admin can log in and collect/view venues
- Admin can view all venues via the dropdown
- Admin can reset the number of flags a photo has (Flag limit is 5)
- Admin can reset the number of times a venue has been curated (Curated limit is 5)
- By default, saving a venue as an admin will not increase curated count

## Curator Site
http://crave-venues-staging.meteor.com/curator

### Notes
- Curators are tracked via "sessions" to enable venue "locking"
- "Locking" simply hides venues, that are currently being worked on, from the dropdown
- Curators can flag photos up to 5 times until they become permanently flagged
- Curators can save venues up to 5 times until they become permanently curated
