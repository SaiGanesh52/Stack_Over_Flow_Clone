erDiagram

    USERS {
        int id PK
        string username
        string email
        string password_hash

        string bio
        string profile_pic

        int reputation
        bool is_active

        datetime joined_at
        datetime last_login
    }

    QUESTIONS {
        int id PK
        int author_id FK

        string title
        text body

        int votes
        int views
        int answer_count

        bool is_closed

        datetime created_at
        datetime updated_at
        datetime closed_at
    }

    ANSWERS {
        int id PK
        int question_id FK
        int author_id FK

        text body

        int votes
        bool is_accepted

        datetime created_at
        datetime updated_at
        datetime accepted_at
    }

    COMMENTS {
        int id PK
        int author_id FK
        int question_id FK
        int answer_id FK
        int parent_comment_id FK

        text body

        bool is_deleted

        datetime created_at
        datetime updated_at
    }

    TAGS {
        int id PK

        string name
        string description

        int question_count

        datetime created_at
    }

    QUESTION_TAGS {
        int question_id FK
        int tag_id FK

        datetime created_at
    }

    VOTES {
        int id PK

        int user_id FK
        int question_id FK
        int answer_id FK

        int value

        datetime voted_at
    }

    BOOKMARKS {
        int id PK

        int user_id FK
        int question_id FK

        datetime created_at
    }

    FOLLOWS {
        int id PK

        int follower_id FK
        int following_id FK

        datetime created_at
    }

    NOTIFICATIONS {
        int id PK

        int user_id FK
        int from_user_id FK

        string notification_type
        string message

        bool is_read

        datetime created_at
    }

    BADGES {
        int id PK

        string name
        string description
        string icon
    }

    USER_BADGES {
        int id PK

        int user_id FK
        int badge_id FK

        datetime awarded_at
    }

    USERS ||--o{ QUESTIONS : asks
    USERS ||--o{ ANSWERS : writes
    USERS ||--o{ COMMENTS : writes

    QUESTIONS ||--o{ ANSWERS : has
    QUESTIONS ||--o{ COMMENTS : receives
    ANSWERS ||--o{ COMMENTS : receives

    QUESTIONS ||--o{ QUESTION_TAGS : tagged
    TAGS ||--o{ QUESTION_TAGS : categorizes

    USERS ||--o{ VOTES : casts
    QUESTIONS ||--o{ VOTES : receives
    ANSWERS ||--o{ VOTES : receives

    USERS ||--o{ BOOKMARKS : creates
    QUESTIONS ||--o{ BOOKMARKS : saved

    USERS ||--o{ NOTIFICATIONS : receives

    USERS ||--o{ USER_BADGES : earns
    BADGES ||--o{ USER_BADGES : awarded

    USERS ||--o{ FOLLOWS : follower
    USERS ||--o{ FOLLOWS : following

    COMMENTS ||--o{ COMMENTS : replies_to