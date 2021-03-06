# project-issue-tracker
This project is meant to showcase and exercise various serverless technologies and methodologies learned during my Udacity course.
It is models a simple issue tracking system like Trello.
A user may have any number of projects, a project may have any number of issues.
When a user logs in, she can only see her own projects, and likewise only the issues belonging to her projects.

The client app included is, admitedly, completely reused from one of the serverless projects. I did a little work on it, but I've never used React before and I assumed the point of this capstone was not to show off what I learned about React.

One way in which I wanted to explore these new technologies was with the table schema in DynamoDB. I went with a less-normalized but seemingly recommended-by-AWS approach, storing projects and issues together in the same table. I believe the intent behind this recommendation is to speed up reads and writes of related items, as well as making transactions on parent items atomic. There was certainly some hoops to jump through to stick to this overloaded schema but I think it makes sense for specific applications. I'm not positive this is one of those applications, but I was curious to see.

To test, first run the client app and log in. Grab the jwt token from the console, and put that in to your postman collection variables. 

There are variables in the postman collection so store a projectId, issueId, and projectId to delete, as well as apiId and auth token. Any of these could in theory be used for add / update / delete. 
