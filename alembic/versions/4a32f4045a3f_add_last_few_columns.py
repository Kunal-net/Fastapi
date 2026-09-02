"""add last few columns

Revision ID: 4a32f4045a3f
Revises: 10ab061dc5bd
Create Date: 2026-09-02 22:09:47.865078

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4a32f4045a3f'
down_revision: Union[str, Sequence[str], None] = '10ab061dc5bd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('post',
                  sa.Column('published', sa.Boolean, server_default='TRUE', nullable=False))
    op.add_column('post',
                  sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False))


def downgrade() -> None:
    op.drop_column('post', 'published')
    op.drop_column('post', 'created_at')
    pass
