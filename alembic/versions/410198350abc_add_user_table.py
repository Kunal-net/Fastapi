"""add_user_table

Revision ID: 410198350abc
Revises: 495dc94339c7
Create Date: 2026-09-02 21:52:13.283784

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '410198350abc'
down_revision: Union[str, Sequence[str], None] = '495dc94339c7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('user',
                    sa.Column('email', sa.String(255), nullable=False),
                    sa.Column('password', sa.String(255), nullable=False),
                    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
                    sa.Column('id', sa.Integer, primary_key=True),
                    sa.PrimaryKeyConstraint('id'),
                  sa.UniqueConstraint('email')
                  )


def downgrade() -> None:
    op.drop_table('user')
    
