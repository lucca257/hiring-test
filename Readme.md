
**Problem1** \
Fix "Add New Notice" Page \
<mark>/app/notices/add</mark> \
When click the 'Save' button, 'description' doesn't be saved. \
<b>Fix it.</b>

**Problem2** \
Complete CRUD operation in Student management page. \
<mark>/src/modules/students/students-controller.js</mark>

**Notes** \
I have completed the technical test and found it to be well-structured. I did not see the need to modify its existing structure.

Additionally, I created a docker-compose file to facilitate setting up the environment if needed. I also implemented an integration test for the controller of the modified class to ensure proper functionality.

Moreover, I removed the snore-log package due to a reported vulnerability (reference). Since the project functioned correctly without it, I opted not to replace it with an alternative package.
