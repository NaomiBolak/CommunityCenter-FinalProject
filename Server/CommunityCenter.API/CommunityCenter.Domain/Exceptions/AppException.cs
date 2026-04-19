using System;


namespace CommunityCenter.Domain.Exceptions
{
    public class AppException : System.Exception // שימוש בשם המלא מונע את ההתנגשות
    {
        public int StatusCode { get; set; }

        public AppException(string message, int statusCode = 400) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
