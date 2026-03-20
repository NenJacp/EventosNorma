FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy solution and project files
COPY EventosNorma.sln .
COPY src/EventosNorma.Domain/*.csproj ./src/EventosNorma.Domain/
COPY src/EventosNorma.Application/*.csproj ./src/EventosNorma.Application/
COPY src/EventosNorma.Infrastructure/*.csproj ./src/EventosNorma.Infrastructure/
COPY src/EventosNorma.Presentation/*.csproj ./src/EventosNorma.Presentation/

# Restore dependencies
RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish src/EventosNorma.Presentation/EventosNorma.Presentation.csproj -c Release -o /out

# Final image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /out .
ENTRYPOINT ["dotnet", "EventosNorma.Presentation.dll"]
