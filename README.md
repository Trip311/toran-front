run in dev: npm run dev
localhost:3000

make sure backend (toran-backend) is up


in contianer:
docker image build -t toran-front .
docker run -dit --name toran-front -p 3000:80 toran-front
see it in localhost:3000

Features/Bugs:

* Better organization of the frontend and backend (clean up the code and improve it both visually and functionally).

* Prevent users (except admin) from editing other users' events.

* Change the calendar font to be consistent with the menu and overall site forms — all should use the same font.

* Improve the design of the created requests.

* Remove the "your name" field in Join and redesign it better.

* Remove the "You have joined the shift" alert and replace it with a styled message instead.

* Improve the design of the "My Requests" form (both the form itself and the requests that are created).

* Fix background gaps so scrolling doesn’t reveal empty sections in the background.

* Fix the issue where the icon shrinks when there’s a number in the counter.

* Improve the design of the approval card for the admin.

* Remove the admin approval alert.

* In the About section, check the issue with the title.

Add to Join (Shift Pickup Functionality):

* The idea is that a user can take a shift from someone else once they choose this option.

The shift pickup request will be sent directly to the admin for approval.

Once approved, the name of the user who joined will replace the proposed date in the original request.
* add middleware in backend of hashing password (in general imporve security)
