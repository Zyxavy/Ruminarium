"""backfill_search_vectors

Revision ID: 479effa17a6e
Revises: 8404474b076d
Create Date: 2026-02-24 22:53:49.015924

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '479effa17a6e'
down_revision: Union[str, Sequence[str], None] = '8404474b076d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
     op.execute("""
        UPDATE journals
        SET search_vector = to_tsvector('english',
            coalesce(title,'') || ' ' || coalesce(content,'')
        );
    """)


def downgrade() -> None:
    """Downgrade schema."""
    pass
