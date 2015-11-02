# TutorMe API Documentation

## Call Styling
Calls should be made via their appropriate API handles with JSON bodies in the request. Fields consumed will be listed in the documentation, extraenous fields will be stripped/ignored.

## - <root>
### index `[http/https get]`
    /
Redirects to CAS Authentication, but contextually serves the appropriate site page for web browsers on successful authentication. iOS should ignore redirects after authentication, and preserve session cookies for HTTP GETs to populate views.
### user `[https get]`
    /user
Returns a JSON object denoting the current username of the authenticated user.

**Example Output**
```JSON
{
    "username" : "some_user"
}
```

### docs
    /docs
Serves this documentation in non-production environments. May be enabled in configuration in future to be served to site-admins only.


## - Student
### get  `[https get]`
    /api/students/get
Used to get information about a student, by a field provided by the database. Returns all non-database specific data on a user.

**Permissions**
- Students may only poll on themselves
- Tutors may only poll on students they have existing appointments or appointment requests with.
- Administrators/Site Admins may poll any student.

**Valid fields**
- ID : Number - The ID *(800 Number)* of the Student
- OtherID : Number - Any other ID assigned by Banner.
- FirstName : String
- LastName : String
- FullName : String - Concatenation of the above two fields
- Email : String

**Exposed Fields**
  - ID : String
  - OtherID : Number
  - FirstName : String
  - LastName : String
  - FullName : String
  - Gender : String
  - Major : String
  - Email : String
  - IsTutor : Boolean

**Example Query**
```
    /api/get?field=FullName&value=Some%20User
```
**Expected Response**

*__On Success__*
```JSON
{
    "success" : true,
    "result" : {
        "FirstName" : "Some",
        "LastName" : "User",
    }
}
```

*__On Failure__*
```JSON
{
    "success" : false,
    "result" : "Some Error String"
}
```

### getStudentCourses  `[https get]`
    /api/students/getStudentCourses/

Used to get the courses a student is taking. Resolves ObjectID to full object values, returning all non-database specific values from the appropriate document. Does NOT populate students, use `/api/courses/getStudentsInCourse` instead.

**Permissions**
- Students may only poll on themselves
- Tutors may only poll on students they have existing appointments or appointment requests with.
- Administrators/Site Admins may poll any student.

**Example Query**
```
    /api/students/getStudentCourses?StudentID=800987654
```
**Expected Response**

*__On Success__*
```JSON
{
    "success" : true,
    "result" : [
        {
            "CourseTitle" : "Some Hard Course",
            "CourseSubject" : "Computer Science",
            "CourseSection" : 432,
            "InstructorFirstName" : "Joshua",
            "InstructorLastName" : "Eckeroth"
            "InstructorEmail" : "jeckroth@stetson.edu"
        },
    ]
}
```

*__On Failure__*
```JSON
{
    "success" : false,
    "result" : "Some Error String"
}
```

### getStudentCourses  `[https get]`
    /api/students/getStudentProfessors

Used to get the professors for courses a student is taking.

**Permissions**
- Students may only poll on themselves
- Tutors may only poll on students they have existing appointments or appointment requests with.
- Administrators/Site Admins may poll any student.

**Example Query**
```
    /api/students/getStudentProfessors?StudentID=800987654
```
**Expected Response**

*__On Success__*
```JSON
{
    "success" : true,
    "result" : [
        {
            "InstructorFirstName" : "Joshua",
            "InstructorLastName" : "Eckeroth",
            "InstructorEmail" : "jeckroth@stetson.edu"
        },
    ]
}
```

*__On Failure__*
```JSON
{
    "success" : false,
    "result" : "Some Error String"
}
```
