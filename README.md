Class Clown is an application for recording quiz results. from iBooks. on an iPad. OMG.


the application has 3 Parts:

iBooks Dashboard widget that renders a question and the possible answers. Reports the result back to the
   server via a url in an img tag. Because iBooks be ghetto and allow now xhr requests. Thanks iBooks.

Backend: Responds to request for an image with url parameters containing the quiz_id and the answer_id.
   running on Heroku this will look like:
    http://classclown.heroku.com/record_result.gif?quiz_id=1&answer_id=2
    pushes the results to the frontend in realtime

    

Frontend: Displays the 


