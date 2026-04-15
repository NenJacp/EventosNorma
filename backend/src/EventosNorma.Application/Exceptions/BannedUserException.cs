namespace EventosNorma.Application.Exceptions;

public class BannedUserException : Exception
{
    public string BanReason { get; }

    public BannedUserException(string reason) : base($"Usuario baneado. Razón: {reason}")
    {
        BanReason = reason;
    }
}
