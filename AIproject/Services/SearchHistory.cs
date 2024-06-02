using AIproject.Data;
using AIproject.Models;

namespace AIproject.Services;
public class SearchHistoryService
{
    private readonly ApplicationDbContext _context;

    public SearchHistoryService(ApplicationDbContext context)
    {
        _context = context;
    }

public async Task AddToSearchHistory(string searchQuery, int userId)
{
    var searchHistoryEntry = new SearchHistory
    {
        SearchQuery = searchQuery,
        Timestamp = DateTime.UtcNow,
        UserId = userId
    };

    _context.SearchHistory.Add(searchHistoryEntry);
    await _context.SaveChangesAsync();
}

}