from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.exc import IntegrityError
import json

from .models import DBSession, Matakuliah


@view_config(route_name='get_all_matakuliah', request_method='GET', renderer='json')
def get_all_matakuliah(request):
    """Get all matakuliah"""
    matakuliahs = DBSession.query(Matakuliah).all()
    return {
        'matakuliahs': [mk.to_dict() for mk in matakuliahs]
    }


@view_config(route_name='get_matakuliah', request_method='GET', renderer='json')
def get_matakuliah(request):
    """Get a single matakuliah by id"""
    mk_id = int(request.matchdict['id'])
    matakuliah = DBSession.query(Matakuliah).filter_by(id=mk_id).first()
    
    if not matakuliah:
        request.response.status = 404
        return {'error': 'Matakuliah tidak ditemukan'}
    
    return matakuliah.to_dict()


@view_config(route_name='create_matakuliah', request_method='POST', renderer='json')
def create_matakuliah(request):
    """Create a new matakuliah"""
    try:
        data = request.json_body
        
        # Validasi input
        required_fields = ['kode_mk', 'nama_mk', 'sks', 'semester']
        for field in required_fields:
            if field not in data:
                request.response.status = 400
                return {'error': f'Field {field} wajib diisi'}
        
        # Create new matakuliah
        matakuliah = Matakuliah(
            kode_mk=data['kode_mk'],
            nama_mk=data['nama_mk'],
            sks=int(data['sks']),
            semester=int(data['semester'])
        )
        
        DBSession.add(matakuliah)
        DBSession.flush()
        
        request.response.status = 201
        return {
            'message': 'Matakuliah berhasil ditambahkan',
            'matakuliah': matakuliah.to_dict()
        }
        
    except IntegrityError:
        DBSession.rollback()
        request.response.status = 400
        return {'error': 'Kode mata kuliah sudah digunakan'}
    except (ValueError, KeyError) as e:
        request.response.status = 400
        return {'error': f'Data tidak valid: {str(e)}'}


@view_config(route_name='update_matakuliah', request_method='PUT', renderer='json')
def update_matakuliah(request):
    """Update an existing matakuliah"""
    mk_id = int(request.matchdict['id'])
    matakuliah = DBSession.query(Matakuliah).filter_by(id=mk_id).first()
    
    if not matakuliah:
        request.response.status = 404
        return {'error': 'Matakuliah tidak ditemukan'}
    
    try:
        data = request.json_body
        
        # Update fields if provided
        if 'kode_mk' in data:
            matakuliah.kode_mk = data['kode_mk']
        if 'nama_mk' in data:
            matakuliah.nama_mk = data['nama_mk']
        if 'sks' in data:
            matakuliah.sks = int(data['sks'])
        if 'semester' in data:
            matakuliah.semester = int(data['semester'])
        
        DBSession.flush()
        
        return {
            'message': 'Matakuliah berhasil diupdate',
            'matakuliah': matakuliah.to_dict()
        }
        
    except IntegrityError:
        DBSession.rollback()
        request.response.status = 400
        return {'error': 'Kode mata kuliah sudah digunakan'}
    except (ValueError, KeyError) as e:
        request.response.status = 400
        return {'error': f'Data tidak valid: {str(e)}'}


@view_config(route_name='delete_matakuliah', request_method='DELETE', renderer='json')
def delete_matakuliah(request):
    """Delete a matakuliah"""
    mk_id = int(request.matchdict['id'])
    matakuliah = DBSession.query(Matakuliah).filter_by(id=mk_id).first()
    
    if not matakuliah:
        request.response.status = 404
        return {'error': 'Matakuliah tidak ditemukan'}
    
    DBSession.delete(matakuliah)
    DBSession.flush()
    
    return {
        'message': 'Matakuliah berhasil dihapus',
        'id': mk_id
    }
