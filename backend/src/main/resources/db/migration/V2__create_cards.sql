CREATE TABLE cards (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(100)  NOT NULL,
    description VARCHAR(500),
    priority    VARCHAR(4)    NOT NULL DEFAULT 'mid'
                    CHECK (priority IN ('high', 'mid', 'low')),
    due_date    DATE,
    status      VARCHAR(6)    NOT NULL
                    CHECK (status IN ('todo', 'doing', 'done')),
    position    INTEGER       NOT NULL DEFAULT 0,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_cards_status_position ON cards (status, position);
