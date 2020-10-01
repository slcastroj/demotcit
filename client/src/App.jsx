import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BounceLoader } from 'react-spinners';
import './App.css';
import { api } from './Utils/Axios';
import { useAppStore } from './Utils/useAppStore';

export const App = () => {
    const { register, handleSubmit, reset, errors } = useForm();
    const { loading, setLoading, posts, setPosts } = useAppStore();

    const [reload, setReload] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function fetch() {
            setLoading(true);
            await api.get('posts').then(response => setPosts(response.data)).catch(() => alert('Couldn\'t load posts'));
            setLoading(false);
            setReload(false);
        }
        if (!reload) { return; }
        fetch();
    }, [setPosts]);

    async function onSubmit(data) {
        setLoading(true);
        await api.post('posts', data).then(response => {
            setPosts([...posts, response.data]);
            reset();
        }).catch(() => alert('Couldn\'t create post'))
        setLoading(false);
    }

    async function deletePost(id) {
        setLoading(true);
        await api.delete(`posts/${id}`).then(response => {
            setPosts(posts.filter(post => post.id != response.data.id));
            reset();
        }).catch(() => alert('Couldn\'t delete post'))
        setLoading(false);
    }

    function onChangeSearch(event) {
        const value = event.currentTarget.value;
        setSearch(value);
    }

    const filteredPostsMemo = useMemo(() => {
        const regex = new RegExp(search, 'i');
        return posts.filter(post => regex.test(post.name));
    })

    return <div className='row app p-4'>
        {loading ? <BounceLoader css={{ margin: '40vh auto' }} color='var(--primary)' size={64} /> : <Fragment>
            <div className='col-12 mb-3'>
                <p className='display-4'>Publicaciones</p>
            </div>
            <div className='col-12 col-lg-3 mb-3'>
                <h4 className='mb-3'>Crear publicación:</h4>
                <form className='form' onSubmit={handleSubmit(onSubmit)}>
                    <div className='form-group'>
                        <label htmlFor='name'><b>Nombre:</b></label>
                        <input type='text' className='form-control' name='name'
                            ref={register({ required: 'Campo obligatorio', minLength: { value: 4, message: 'Mínimo 4 carácteres' }, maxLength: { value: 64, message: 'Máximo 64 carácteres' } })} />
                        {errors.name && <p className='text-danger m-0'>{errors.name.message}</p>}
                    </div>
                    <div className='form-group'>
                        <label htmlFor='name'><b>Descripción:</b></label>
                        <textarea className='form-control' name='description' rows={5} ref={register({ maxLength: { value: 256, message: 'Máximo 256 carácteres' } })} />
                        {errors.description && <p className='text-danger m-0'>{errors.description.message}</p>}
                    </div>
                    <div className='text-right'>
                        <button className='w-100 btn btn-primary' type='submit'>
                            Crear publicación
                        </button>
                    </div>
                </form>
                <hr className='d-block d-lg-none' />
            </div>
            <div className='col-12 col-lg-9 mb-3'>
                <div className="row mb-3">
                    <div className="col-12 col-lg-4 offset-0 offset-lg-8">
                        <div className="input-group">
                            <input type='text' className='form-control' placeholder='Buscar...' value={search} onChange={onChangeSearch} />
                        </div>
                    </div>
                </div>
                <table className='table table-bordered rounded table-responsive-sm'>
                    <thead className='thead-dark'>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Opciones</th>
                    </thead>
                    <tbody>
                        {filteredPostsMemo.length == 0 ? <tr className='py-5 text-center'>
                            <td colSpan={4}>No hay publicaciones disponibles</td>
                        </tr> : filteredPostsMemo.map(post => {
                            return <tr>
                                <td className='column-name' title={post.name}>{post.name}</td>
                                <td className='column-description' title={post.description}>{post.description}</td>
                                <td className='column-options text-center'>
                                    <span onClick={() => deletePost(post.id)} className='deletePost text-danger'>[Eliminar]</span>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </Fragment>}
    </div>
}