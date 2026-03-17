# Feature Specifications Document
## MealCart Platform - Detailed Feature Definitions

**Document Version:** 1.0  
**Date:** November 13, 2025  
**Related to:** PRD.md

---

## Table of Contents
1. [Recipe Discovery](#recipe-discovery)
2. [Recipe Management](#recipe-management)
3. [Grocery List Generation](#grocery-list-generation)
4. [Meal Planning](#meal-planning)
5. [AI Assistance](#ai-assistance)
6. [User Management](#user-management)

---

## Recipe Discovery

### Feature: Advanced Recipe Search
**Unique ID:** SEARCH-001  
**Priority:** P0 (Critical)  
**Status:** Completed ✅

#### Overview
Users can search for recipes using multiple criteria including recipe name, cuisine type, ingredients, cooking time, and dietary restrictions.

#### User Interface
```
┌─────────────────────────────────────────┐
│         🔍 Recipe Search                 │
├─────────────────────────────────────────┤
│ Search: [         Pasta         ]       │
├─────────────────────────────────────────┤
│ Filters:                                 │
│ ├─ Cuisine: [Italian▼]                 │
│ ├─ Cooking Time: [0-30 min ▼]          │
│ ├─ Difficulty: [All ▼]                 │
│ └─ Dietary: [Select tags...]           │
│                                         │
│ [Search] [Clear Filters]                │
├─────────────────────────────────────────┤
│ Results: 24 recipes found               │
├─────────────────────────────────────────┤
│ [Recipe Card] [Recipe Card] [Recipe]    │
│ [Recipe Card] [Recipe Card] [Recipe]    │
│ [Recipe Card] [Recipe Card] [Recipe]    │
└─────────────────────────────────────────┘
```

#### Functional Requirements
| ID | Requirement | Details |
|----|-----------|----|
| SR-001 | Text Search | Search by recipe name, cuisine, or ingredients |
| SR-002 | Cuisine Filter | Italian, Asian, Mexican, Indian, American, etc. |
| SR-003 | Time Filter | Quick (15min), Medium (15-45min), Long (45min+) |
| SR-004 | Difficulty Filter | Easy, Medium, Hard |
| SR-005 | Dietary Filter | Vegan, Vegetarian, Gluten-Free, Keto, Paleo |
| SR-006 | Results Pagination | 12 results per page, infinite scroll option |
| SR-007 | Sort Options | Relevance, Rating, Cooking Time, Newest |
| SR-008 | Search History | Store last 10 searches for quick access |
| SR-009 | Recent Searches | Show recently viewed recipes |
| SR-010 | Save Search | Bookmark search queries for future use |

#### Performance Requirements
- Search response time: < 500ms
- Load first 12 results: < 1 second
- Pagination load: < 500ms
- Autocomplete suggestions: < 200ms

#### Data Returned
```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": "recipe_123",
        "name": "Classic Pasta Carbonara",
        "image": "url",
        "cookingTime": 20,
        "servings": 4,
        "difficulty": "easy",
        "cuisine": "Italian",
        "rating": 4.5,
        "savedCount": 523
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalResults": 24,
      "hasNextPage": true
    }
  }
}
```

---

## Recipe Management

### Feature: Save & Organize Recipes
**Unique ID:** RECIPE-001  
**Priority:** P0 (Critical)  
**Status:** Completed ✅

#### Overview
Users can save recipes to their personal collection, rate them, add notes, and organize by custom categories.

#### User Story Flow
```
1. User views recipe detail page
2. Clicks "Save Recipe" or heart icon
3. Recipe added to "Saved Recipes" collection
4. Can rate recipe (1-5 stars)
5. Can add personal notes/modifications
6. Recipe appears in user's "My Recipes" section
7. Can remove recipe from saved list
```

#### Functional Requirements
| ID | Requirement | Details |
|----|-----------|----|
| RM-001 | Save Recipe | One-click save to collection |
| RM-002 | Unsave Recipe | One-click remove from collection |
| RM-003 | Rating System | 1-5 star rating with explanation text |
| RM-004 | Personal Notes | 500 char limit for user notes/modifications |
| RM-005 | Tags/Categories | Custom tags (breakfast, quick, favorite) |
| RM-006 | Cooking Count | Track times recipe was cooked |
| RM-007 | Last Cooked | Store date of last preparation |
| RM-008 | Cooking Notes | Different notes per cooking session |
| RM-009 | Skill Level | Track experience with recipe |
| RM-010 | Image Upload | Option to upload personal photos |

#### Data Model
```javascript
SavedRecipe {
  _id: ObjectId,
  userId: ObjectId,
  recipeId: ObjectId,
  rating: Number (1-5),
  notes: String,
  tags: [String],
  timesCooked: Number,
  lastCooked: Date,
  savedAt: Date,
  isFavorite: Boolean,
  personalImages: [String]
}
```

---

## Grocery List Generation

### Feature: Smart Grocery List from Recipes
**Unique ID:** GROCERY-001  
**Priority:** P0 (Critical)  
**Status:** Completed ✅

#### Overview
Generate organized grocery lists from one or multiple recipes, with automatic quantity consolidation and categorization.

#### User Workflow
```
1. User selects 2-5 recipes to buy ingredients for
2. Clicks "Generate Shopping List"
3. System consolidates duplicate ingredients
4. Groups by category (produce, dairy, meat, etc.)
5. Shows total quantities needed
6. User can modify quantities
7. Can check items off while shopping
8. Export to PDF, email, or print
```

#### Functional Requirements
| ID | Requirement | Details |
|----|-----------|----|
| GL-001 | Multi-Recipe Input | Select 1-10 recipes at once |
| GL-002 | Ingredient Consolidation | Combine duplicates (1 cup + 2 cups = 3 cups) |
| GL-003 | Unit Conversion | Convert between units intelligently |
| GL-004 | Auto-Categorization | Group by produce, dairy, meat, pantry, etc. |
| GL-005 | Manual Categorization | User can change item categories |
| GL-006 | Add Items | Add custom items to list |
| GL-007 | Remove Items | Remove items from list |
| GL-008 | Quantity Editing | Edit amount and unit for each item |
| GL-009 | Checkbox Tracking | Check off items while shopping |
| GL-010 | Price Estimation | Show estimated cost per item (future) |
| GL-011 | Allergen Tags | Flag items with user allergies |
| GL-012 | Export Options | PDF, CSV, Email, Print, Share Link |
| GL-013 | Save List | Save list for future reference |
| GL-014 | Share List | Share with family/friends via link |

#### Example Output
```json
{
  "listId": "list_456",
  "createdBy": "user_123",
  "createdAt": "2025-11-13T10:00:00Z",
  "recipes": ["pasta_123", "salad_456"],
  "categories": {
    "Produce": [
      {
        "name": "Tomato",
        "quantity": 3,
        "unit": "medium",
        "reason": "Pasta (2) + Salad (1)",
        "checked": false
      }
    ],
    "Dairy": [
      {
        "name": "Parmesan Cheese",
        "quantity": 1,
        "unit": "cup",
        "reason": "Pasta",
        "checked": true
      }
    ]
  }
}
```

---

## Meal Planning

### Feature: Weekly Meal Planner
**Unique ID:** MEAL-001  
**Priority:** P1 (High)  
**Status:** In Progress 🔄

#### Overview
Multi-day meal planning with recipe assignment, nutritional balance, and automatic shopping list generation.

#### User Workflow
```
┌─────────────────────────────────────────┐
│     Weekly Meal Planner                  │
├─────────────────────────────────────────┤
│ Week of: [Nov 13 - Nov 19] [◀ ▶]       │
├─────────────────────────────────────────┤
│ Monday:                                  │
│   Breakfast: [+ Add Recipe]              │
│   Lunch:     [+ Add Recipe]              │
│   Dinner:    [+ Add Recipe]              │
│   Snacks:    [+ Add Recipe]              │
├─────────────────────────────────────────┤
│ Tuesday: ... (same structure)            │
│ Wednesday: ... (same structure)          │
│ ... (continue for full week)             │
├─────────────────────────────────────────┤
│ [Weekly Nutrition Summary]               │
│ Calories: 15,000 | Protein: 400g        │
│                                         │
│ [Generate Shopping List] [Print Plan]   │
└─────────────────────────────────────────┘
```

#### Functional Requirements
| ID | Requirement | Details |
|----|-----------|----|
| MP-001 | Create Plan | Create new meal plan for any date range |
| MP-002 | Date Range | Support 1 week, 2 weeks, 3 weeks, 1 month |
| MP-003 | Meal Types | Breakfast, Lunch, Dinner, Snacks |
| MP-004 | Assign Recipes | Drag-drop or click to assign recipes |
| MP-005 | Multiple Plans | Create multiple simultaneous plans |
| MP-006 | Daily Summary | Show daily calorie/macro totals |
| MP-007 | Weekly Summary | Show weekly nutrition balance |
| MP-008 | Duplicate Days | Copy one day to other days quickly |
| MP-009 | Suggested Pairing | AI suggests recipes that complement |
| MP-010 | Nutritional Balance | Warn if meals unbalanced |
| MP-011 | Shopping List Gen | Auto-generate from meal plan |
| MP-012 | Print View | Print-friendly meal plan format |
| MP-013 | Export Options | PDF, CSV, ICS calendar format |
| MP-014 | Share Plan | Share with family/friends |
| MP-015 | History | View past meal plans |

#### Data Model
```javascript
MealPlan {
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  startDate: Date,
  endDate: Date,
  meals: [
    {
      date: Date,
      breakfast: { recipeId, name, calories },
      lunch: { recipeId, name, calories },
      dinner: { recipeId, name, calories },
      snacks: { recipeId, name, calories }
    }
  ],
  nutritionSummary: {
    totalCalories: Number,
    totalProtein: Number,
    totalCarbs: Number,
    totalFat: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## AI Assistance

### Feature: AI Recipe Generator
**Unique ID:** AI-001  
**Priority:** P1 (High)  
**Status:** In Progress 🔄

#### Overview
Generate completely new recipes using Google Gemini AI based on user preferences and constraints.

#### User Workflow
```
1. Click "Generate Recipe" button
2. Enter preferences:
   - Cuisine type (Italian, Asian, etc.)
   - Difficulty level (Easy, Medium, Hard)
   - Cooking time (15-30 min, 30-60 min, 60+ min)
   - Dietary restrictions (Vegan, Keto, etc.)
   - Available ingredients (optional)
3. System calls Gemini AI with structured prompt
4. AI generates complete recipe with:
   - Name and description
   - Ingredients with quantities
   - Step-by-step instructions
   - Cooking/prep times
   - Servings
   - Nutritional info
5. System finds matching food image from Unsplash
6. User can:
   - Save recipe
   - Regenerate different version
   - Adjust servings
   - Add to meal plan
```

#### Functional Requirements
| ID | Requirement | Details |
|----|-----------|----|
| AI-001 | Cuisine Selection | Multiple cuisine types available |
| AI-002 | Difficulty Level | Easy, Medium, Hard options |
| AI-003 | Cooking Time | Respect user's time constraints |
| AI-004 | Dietary Support | Vegan, Vegetarian, Keto, Paleo, Gluten-Free |
| AI-005 | Ingredient Input | Accept available ingredients |
| AI-006 | Response Quality | Generated recipes must be valid |
| AI-007 | Image Search | Match generated recipe with food image |
| AI-008 | Regenerate | Generate alternative recipe variants |
| AI-009 | Save Generated | Save AI-generated recipes to collection |
| AI-010 | Batch Generate | Generate 3-5 recipes at once |
| AI-011 | Feedback | User rates generated recipe quality |
| AI-012 | Response Time | Generate complete recipe < 3 seconds |

#### AI Prompt Structure
```
Generate a {CUISINE} {MEAL_TYPE} recipe with these constraints:
- Difficulty: {DIFFICULTY}
- Cooking time: ~{TIME} minutes
- Dietary: {DIETARY_TAGS}
- Available ingredients: {INGREDIENTS}

Required format:
{
  "name": "Recipe Name",
  "description": "Brief description",
  "servings": 4,
  "preparationTime": 15,
  "cookingTime": 30,
  "ingredients": [
    {"name": "...", "amount": "...", "unit": "..."}
  ],
  "instructions": ["Step 1", "Step 2", ...],
  "nutrition": {
    "calories": ...,
    "protein": "...g",
    "carbs": "...g",
    "fat": "...g"
  }
}
```

---

### Feature: AI Chat Assistant
**Unique ID:** AI-002  
**Priority:** P1 (High)  
**Status:** In Progress 🔄

#### Overview
Conversational AI assistant providing cooking tips, ingredient substitutions, and personalized meal recommendations.

#### Features
| Feature | Description | Example |
|---------|-------------|---------|
| **Cooking Tips** | Answer cooking questions | "How long to boil pasta?" |
| **Substitutions** | Suggest ingredient replacements | "No eggs? Use applesauce" |
| **Dietary Adaptation** | Modify recipes for restrictions | "Make this vegan" |
| **Recipe Questions** | Answer about specific recipes | "Can I add wine to this?" |
| **Meal Suggestions** | Recommend based on preferences | "What's good for lunch?" |
| **Nutritional Info** | Provide nutritional details | "Calories in this recipe?" |
| **Serving Adjustment** | Help scale recipes | "Recipe for 8 instead of 4?" |

#### Technical Implementation
- **Model**: Google Gemini 1.5 Flash (fast, cost-effective)
- **Context**: Include user profile, saved recipes, dietary restrictions
- **Memory**: Store conversation history (last 10 messages)
- **Safety**: Filter inappropriate responses
- **Confidence**: Only provide confident recommendations

---

## User Management

### Feature: User Profiles & Preferences
**Unique ID:** USER-001  
**Priority:** P0 (Critical)  
**Status:** Completed ✅

#### Overview
User accounts with comprehensive profiles, dietary preferences, allergy tracking, and personalized experiences.

#### User Profile Structure
```
┌─────────────────────────────────┐
│     👤 User Profile              │
├─────────────────────────────────┤
│ [Profile Photo]  John Doe        │
│                  @johndoe        │
│ john@example.com                 │
│                                 │
│ Bio: Love cooking Asian food    │
├─────────────────────────────────┤
│ Preferences:                     │
│ ✓ Vegan  ✓ Gluten-Free          │
│ ✓ Nut Allergy                   │
│                                 │
│ Stats:                           │
│ 45 Saved Recipes | 12 Plans     │
│ 128 Followers | 89 Following    │
├─────────────────────────────────┤
│ [Edit Profile] [Settings]       │
└─────────────────────────────────┘
```

#### Functional Requirements
| ID | Requirement | Details |
|----|-----------|----|
| UP-001 | Registration | Email/password or social login |
| UP-002 | Profile Info | Name, bio, profile picture |
| UP-003 | Email | Change email with verification |
| UP-004 | Password | Secure password change |
| UP-005 | Dietary Tags | Select multiple dietary preferences |
| UP-006 | Allergies | Track allergen list |
| UP-007 | Cooking Level | Beginner, Intermediate, Advanced |
| UP-008 | Cuisine Preferences | Select favorite cuisines |
| UP-009 | Notification Prefs | Email/push notification settings |
| UP-010 | Privacy Settings | Public/Private profile option |
| UP-011 | Data Export | Download personal data (GDPR) |
| UP-012 | Account Deletion | Permanently delete account |
| UP-013 | Stats Dashboard | Show account activity stats |
| UP-014 | Followers/Following | Social connections |

---

## Integration Requirements

### External API Integrations
1. **Spoonacular API** - Recipe data and search
2. **Google Gemini API** - AI features
3. **Unsplash API** - Food images
4. **MongoDB Atlas** - Cloud database

### Third-party Services
1. **JWT Authentication** - User session management
2. **Stripe** (future) - Payment processing
3. **SendGrid** (future) - Email notifications
4. **Twilio** (future) - SMS notifications

---

## Performance & Scalability

### Database Optimization
- Index on userId for fast user queries
- Index on recipeId for recipe lookups
- Index on createdAt for sorting
- Connection pooling for MongoDB

### API Optimization
- Response caching (Redis future)
- Request pagination (default 12 items)
- Lazy loading of images
- Debounced search requests

### Frontend Optimization
- Code splitting by route
- Image lazy loading
- Infinite scroll for lists
- Virtual scrolling for large lists

---

## Success Criteria

Each feature should meet these criteria before release:

- [ ] Requirements fully implemented
- [ ] Unit tests (80%+ coverage)
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Accessibility audit passed
- [ ] Documentation updated
- [ ] User testing completed
- [ ] Product owner approval

---

**Document Version:** 1.0  
**Last Updated:** November 13, 2025  
**Next Review:** February 13, 2026
