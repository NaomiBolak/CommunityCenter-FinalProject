using CommunityCenter.API.Middleware;
using CommunityCenter.API.Middlewares.Handlers;
using CommunityCenter.API.Services;
using CommunityCenter.Application.Interfaces;
using CommunityCenter.Application.Services;
using CommunityCenter.Infrastructure;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using CommunityCenter.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

#region 1. Services Configuration (DI)

// Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (connectionString!.Contains("Host=") || connectionString.Contains("postgres"))
    builder.Services.AddDbContext<DataContext>(options => options.UseNpgsql(connectionString));
else
    builder.Services.AddDbContext<DataContext>(options => options.UseSqlServer(connectionString));

// Controllers + JSON
builder.Services.AddControllers()
    .AddJsonOptions(x =>
        x.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);

builder.Services.AddEndpointsApiExplorer();

// Swagger + JWT
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "כתוב: Bearer {token}"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

#endregion

#region 2. Dependency Injection

// Auth
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<JwtTokenGenerator>();

// Events
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IEventService, EventService>();

// News
builder.Services.AddScoped<INewsRepository, NewsRepository>();
builder.Services.AddScoped<INewsService, NewsService>();

// Contact
builder.Services.AddScoped<IContactRepository, ContactRepository>();
builder.Services.AddScoped<IContactService, ContactService>();

// Profile
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();
builder.Services.AddScoped<IProfileService, ProfileService>();

// Logger
builder.Services.AddSingleton<ILoggerService, FileLoggerService>();

#endregion

#region 3. CORS

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.SetIsOriginAllowed(_ => true)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
        else
        {
            policy.WithOrigins(
                    "http://localhost:3000",
                    "http://localhost:3001")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

#endregion

#region 4. Exception Handling

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

#endregion

#region 5. JWT Authentication

var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = jwtSettings["Key"];

if (string.IsNullOrEmpty(key) || key.Length < 32)
{
    throw new Exception("JWT Key must be at least 32 characters long.");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
        JwtBearerDefaults.AuthenticationScheme;

    options.DefaultChallengeScheme =
        JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters =
        new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],

            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(key))
        };
});

builder.Services.AddAuthorization();

#endregion

var app = builder.Build();

#region 6. Seed Database

using (var scope = app.Services.CreateScope())
{
    var context =
        scope.ServiceProvider.GetRequiredService<DataContext>();

    context.Database.Migrate();
    DbSeeder.Seed(context);
}

#endregion

#region 7. Middleware Pipeline

// CORS first so preflight (OPTIONS) always gets headers
app.UseCors("AllowReactApp");

// Global Exception Handler
app.UseExceptionHandler();

// Logging Middleware
app.UseMiddleware<LoggingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

// Authentication + Authorization
app.UseAuthentication();
app.UseAuthorization();

// Controllers
app.MapControllers();

#endregion

app.Run();
