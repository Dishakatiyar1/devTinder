# DevTinder APIs

authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/updatePassword (update password)

## connectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter

- GET /user/requests/received (get all the connection requests - "interested")
- GET /user/connections (get all the connections - "accepted")
- GET /user/feed (gets the profiles of other users on platform)

Status: Ignored, Interested, Accepted, Rejected
