"""add content column to post table

Revision ID: 495dc94339c7
Revises: f106952041d2
Create Date: 2026-09-02 21:47:35.392240

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '495dc94339c7'
down_revision: Union[str, Sequence[str], None] = 'f106952041d2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('post',sa.Column('content', sa.String(255), nullable=False))


def downgrade() -> None:
    op.drop_column('post','content')
