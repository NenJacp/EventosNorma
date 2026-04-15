using System.Text;
using System.Text.RegularExpressions;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Common.Helpers;

public static class SlugHelper
{
    public static async Task<string> GenerateUniqueSlugAsync(string title, IEventRepository eventRepository, int? excludeEventId = null)
    {
        var baseSlug = GenerateSlug(title);
        var slug = baseSlug;
        var counter = 2;

        while (!await eventRepository.IsSlugUniqueAsync(slug, excludeEventId))
        {
            slug = $"{baseSlug}-{counter++}";
        }

        return slug;
    }

    private static string GenerateSlug(string phrase)
    {
        if (string.IsNullOrEmpty(phrase))
            return "n-a";

        string str = RemoveDiacritics(phrase).ToLower();
        // invalid chars           
        str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
        // convert multiple spaces into one space   
        str = Regex.Replace(str, @"\s+", " ").Trim();
        // cut and trim 
        str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim();
        str = Regex.Replace(str, @"\s", "-"); // hyphens   
        return str;
    }

    private static string RemoveDiacritics(string text)
    {
        var normalizedString = text.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != System.Globalization.UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
    }
}
