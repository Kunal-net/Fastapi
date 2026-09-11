"""added vote table automatically

Revision ID: 4b4f20e629cc
Revises: 4a32f4045a3f
Create Date: 2026-09-02 22:17:13.325443

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '4b4f20e629cc'
down_revision: Union[str, Sequence[str], None] = '4a32f4045a3f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.rename_table('post', 'posts')
    op.rename_table('users', 'Users')
    op.create_table('votes',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('post_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['Users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('user_id', 'post_id')
    )
    op.drop_table('users')
    op.drop_table('post')


def downgrade() -> None:
    op.drop_table('votes')
    op.rename_table('Users', 'users')
    op.rename_table('posts', 'post')
