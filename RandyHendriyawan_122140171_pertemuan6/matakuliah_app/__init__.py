from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from .models import DBSession, Base


def main(global_config, **settings):
    """This function returns a Pyramid WSGI application."""
    
    # Setup database
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    Base.metadata.create_all(engine)
    
    # Setup Pyramid configuration
    config = Configurator(settings=settings)
    config.include('pyramid_tm')
    
    # Add routes
    config.add_route('get_all_matakuliah', '/api/matakuliah')
    config.add_route('create_matakuliah', '/api/matakuliah')
    config.add_route('get_matakuliah', '/api/matakuliah/{id}')
    config.add_route('update_matakuliah', '/api/matakuliah/{id}')
    config.add_route('delete_matakuliah', '/api/matakuliah/{id}')
    
    # Scan for view configurations
    config.scan('.views')
    
    return config.make_wsgi_app()
