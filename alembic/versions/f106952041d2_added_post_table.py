"""added post table

Revision ID: f106952041d2
Revises: 
Create Date: 2026-08-29 10:36:13.997599

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f106952041d2'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('post', sa.Column('content', sa.String(255), nullable=False))
    pass


def downgrade() -> None:
    op.drop_column('post', 'content')
    pass

#ihdfskwdqjdjofjj