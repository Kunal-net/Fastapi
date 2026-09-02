"""add foreign-key relationship

Revision ID: 10ab061dc5bd
Revises: 6fed9ebb0fbc
Create Date: 2026-09-02 22:03:50.645935

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '10ab061dc5bd'
down_revision: Union[str, Sequence[str], None] = '6fed9ebb0fbc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
