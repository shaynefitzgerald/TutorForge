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
    /api/students/get?field=FullName&value=Some%20User
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
## Administrators

### setAsTutor `[https/post]`
    /api/administrator/setAsTutor

Used to setup tutors within the database. May turn a student into a tutor, or create a non-student tutor, the latter requiring more information.

**Permissions**
- Only Administrators are allowed to access and POST to this handle.

**Example Query**

    /api/administrator/setAsTutor

*POST Body for non-Student Tutors*

```json
{
 "ID" : 800999999,
 "Subject" : "CSCI",
 "isStudentTutor" : false,
 "Email" : "someguy@stetson.edu"
}
```

*POST Body for Student Tutors*

```json
    {
        "ID" : 800999999,
        "Subject" : "CSCI",
        "isStudentTutor" : true,
    }
```

**Expected Response**

*__On Success__*

```json
{
    "success" : true,
    "result" : {
        "__v": 0,
        "isStudentTutor": false,
        "ID": 800999999,
        "Email": "someguy@stetson.edu",
        "Subject": "CSCI",
        "LifetimeSessionCount": 0,
        "LastArchivedSession": "1970-01-01T00:00:00.000Z",
        "_id": "564b80de64fee73c0702f93f",
        "Sessions": [0],
        "Username": "someguy",
        "id": "564b80de64fee73c0702f93f"
    }-
}
```
*__On Failure__*
```json
{
    "success" : false,
    "error" : {},
}
```
**Note**: While currently error messages are reported in full to the client, the release build will NOT display this robust form of message. Do NOT write code that relies on specific fields from MongoDB error messages.

### removeTutor `[https/post]`
    /api/administrator/removeTutor

Used to remove tutors from the database.

**Permissions**
- Only Administrators are allowed to access and POST to this handle.

**Example Query**

    /api/students/removeTutor

*POST Body*
```json
{
    "ID" : 800999999,
}
```

**Expected Response**

*__On Success__*
```json
{
    "success" : true
}
```

*__On Failure__*
```json
{
    "success" : false,
    "error" : {},
}
```

## Tutors

### /getAll `[https/get]`

Returns an array of tutors from the database. If passed a Subject, will narrow the search to those subjects.

**Permissions:**
- Anyone can call this function.

**Example Query**
    /api/tutors/getAll?Subject=CSCI

*__On Success__*
```json
{
    "success" : true,
    "result" : [
        {
            "__v": 0,
            "isStudentTutor": false,
            "ID": 800999999,
            "Email": "someguy@stetson.edu",
            "Subject": "CSCI",
            "LifetimeSessionCount": 0,
            "LastArchivedSession": "1970-01-01T00:00:00.000Z",
            "_id": "564b80de64fee73c0702f93f",
            "Sessions": [0],
            "Username": "someguy",
            "id": "564b80de64fee73c0702f93f"
        },
    ],
}
```

*__On Failure__*
```json
{
    "success" : false,
    "error" : {},
}
```
### /get `[https/get]`

Returns a tutor from the database matching the field provided. Note that sessions are also populated by reference, so this is recommended when pulling a given tutor's information on login.

Accepted fields are `ID Email Subject Username`

**Permissions:**
- Anyone can call this function.

**Example Query**

    /api/tutors/get?field=ID&value=800999999


*__On Success__*
```json
{
    "success" : true,
    "result" : [
        {
            "__v": 0,
            "isStudentTutor": false,
            "ID": 800999999,
            "Email": "someguy@stetson.edu",
            "Subject": "CSCI",
            "LifetimeSessionCount": 0,
            "LastArchivedSession": "1970-01-01T00:00:00.000Z",
            "_id": "564b80de64fee73c0702f93f",
            "Sessions": [0],
            "Username": "someguy",
            "id": "564b80de64fee73c0702f93f"
        },
    ],
}
```

*__On Failure__*
```json
{
    "success" : false,
    "error" : {},
}
```

## Appointment Requests

Appointments are handled separately from sessions due to their validation requirements from the tutor.

The appointment lifecycle is as follows:

1. A Student/Tutor makes a request for an appointment using `/api/appointments/makeRequest`
2. The corresponding Tutor can poll their active appointment requests by using `/api/appointments/getAppointmentRequests`
3. The corresponding Tutor will accept/reject the request by using `/api/appointments/respondToRequest`
4. If the appointment is accepted, the appointment will be deleted in the database, and will spawn a Session corresponding to the information provided.
5. If the appointment is rejected, the appointment will be marked as rejected. The appointment wont be deleted from the database until the Student who made the request withdraws it using `/api/appointments/withdrawRequest`

Appointments may be withdrawn at any time by their creator using `/api/appointments/withdraWRequest`

### /makeRequest `[https/post]`

Creates an Appointment Request. Requires the following fields:

- `StudentField `: The field in which to search by for the corresponding student. Recommended fields are `Email`,`ID`, `_id`, but can technically be any. Will select the first result alphabetically for any ambiguous field such as `FirstName`, `LastName`, etc. Do not use `Username` or `FullName`, as these are virtual fields that cannot be polled through this API URL at the moment. (If you need Username polling, please request it.)
- `Student` : The value corresponding to `StudentField`
- `TutorField` : Same as above, but instead corresponding to the Tutor. Recommended fields are also the same as `StudentField`
- `Tutor` : The value corresponding to `TutorField`
- `RequestedStart` : The requested start time/date of the Appointment. Should follow Javascript Date String formatting (see [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date))
- `Location`: A string representing the location for the session. Should be statically selected from the website for continuity, note that this is not currently validated on the backend.
- `Subject` : The 4 Character subject string corresponding to the desired Subject of the appointment (ie: `CSCI`, `ACCT`, etc.)

**Example Request**

    /api/appointments/makeRequest

```JSON
{
 "StudentField" : "ID",
 "Student" : 800126185,
 "TutorField" : "Email",
 "Tutor" : "someguy@stetson.edu",
 "RequestedStart" : "Fri Nov 27 2015 02:59:52 GMT-0500 (Eastern Standard Time)",
 "Location" : "Elizabeth 208",
 "Subject" : "CSCI"
}
```
**Expected Response**

*__On Success__*
```JSON
{
    "success" : true
}
```
*__On Failure__*
```JSON
{
    "success" : false,
    "error" : {},
}
```

### /getAppointmentRequests `[https/get]`

Returns the AppointmentRequests corresponding to the username specified. Note that the `as` parameter specifies Student/Tutor distinctions, so be aware of which you need.

**Example Query**

    /api/getAppointmentRequests?as=Tutor&Username=someguy

**Expected Response**

*__On Success__*
```JSON
    {
        "success" : true,
        "result" : {
            "Student" : {},
            "Tutor" : {},
            "RequestedStart" : "Fri Nov 27 2015 02:59:52 GMT-0500 (Eastern Standard Time)",
            "Location" : "Elizabeth 208",
            "Subject" : "CSCI",
            "Responsed" : false,
        },
    }
```
*__On failure__*
```JSON

```

#### Notes:
- Sesssions also have two other fields:
    - `ResponseRejected` : Denotes if a request has been rejected by the corresponding tutor.
    - `SessionReference` : If this reference exists, assume the appointment request has been accepted. A session will have been created to reflect such.
- Both `Student` and `Tutor` will be populated by their corresponding objects from the database.


## /respondToRequest `[https/post]`

    /api/appointments/respondToRequest

Responds to a request by ObjectId Reference. (where the reference looks like `507f1f77bcf86cd799439011`)

**Example Request**

    /api/appointments/respondToRequest

```JSON
{
    "Reference" : "507f1f77bcf86cd799439011",
    "Response": true
}
```

*__On Success__*
```JSON
{
    "success" : true,
    "result" : "507f1f77bcf86cd799439011"
}
```
*note the result here is the `_id` of the resulting Session*

### /withdrawRequest `[https/post]`

Withraws an AppointmentRequest by reference.

**Example Request**

    /api/appointments/withdrawRequest

```JSON
{
    "Reference" : "507f1f77bcf86cd799439011"
}
```

**Expected Response**

*__On Success__*

```JSON
{
    "success" : true
}
```
