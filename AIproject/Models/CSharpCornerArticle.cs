using System;

namespace AIproject.Models
{
    public class CSharpCornerArticle
    {
        public int Id { get; set; }
        public string? Title { get; set; } // Add '?' to make the property nullable
        public string? Content { get; set; } // Add '?' to make the property nullable
        public DateTime PublishedDate { get; set; }
    }
}

