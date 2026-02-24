"""add_fts_index_and_trigger

Revision ID: 8404474b076d
Revises: 
Create Date: 2026-02-24 22:00:06.700214

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '8404474b076d'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('journals', sa.Column('search_vector', postgresql.TSVECTOR))
    
    op.execute("""
        CREATE INDEX journal_search_idx
        ON journals USING GIN (search_vector);
    """)
    op.execute("""
        CREATE FUNCTION journal_search_vector_update() RETURNS trigger AS $$
        BEGIN
          NEW.search_vector :=
            to_tsvector('english',
              coalesce(NEW.title,'') || ' ' || coalesce(NEW.content,'')
            );
          RETURN NEW;
        END
        $$ LANGUAGE plpgsql;
    """)
    op.execute("""
        CREATE TRIGGER tsvectorupdate
        BEFORE INSERT OR UPDATE ON journals
        FOR EACH ROW EXECUTE FUNCTION journal_search_vector_update();
    """)

def downgrade():
    op.execute("DROP TRIGGER IF EXISTS tsvectorupdate ON journals;")
    op.execute("DROP FUNCTION IF EXISTS journal_search_vector_update;")
    op.execute("DROP INDEX IF EXISTS journal_search_idx;")
    op.drop_column('journals', 'search_vector')