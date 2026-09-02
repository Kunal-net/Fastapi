"""renaming the user table

Revision ID: 6fed9ebb0fbc
Revises: 410198350abc
Create Date: 2026-09-02 21:59:36.851398

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6fed9ebb0fbc'
down_revision: Union[str, Sequence[str], None] = '410198350abc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.rename_table('user', 'users')


def downgrade() -> None:
    op.rename_table('users', 'user')
    pass
