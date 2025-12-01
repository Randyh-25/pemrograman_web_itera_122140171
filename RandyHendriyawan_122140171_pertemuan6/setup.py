from setuptools import setup, find_packages

requires = [
    'pyramid',
    'pyramid_debugtoolbar',
    'waitress',
    'sqlalchemy',
    'alembic',
    'pyramid_tm',
    'zope.sqlalchemy',
]

setup(
    name='matakuliah_app',
    version='0.1',
    packages=find_packages(),
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = matakuliah_app:main',
        ],
    },
)
