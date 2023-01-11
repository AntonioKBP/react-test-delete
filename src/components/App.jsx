import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Component } from 'react';
import { Button } from './Button/Button';
import { SearchBar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { ImageGalleryItem } from './ImageGalleryItem/ImageGalleryItem';
import { Loader } from './Loader/Loader';

import { Container } from './App.styled';
import { Toast } from './Toast/ToastContainer';
import { Modal } from './Modal/Modal';
import { ModalInner } from './Modal/ModalInner';

const KEY = '31349139-c34332f5cc1455d1f889740ec';
const BASE_URL = 'https://pixabay.com/api/?';

export class App extends Component {
  state = {
    image: [],
    search: '',
    isLoading: false,
    page: 1,
    imageHits: [],
    showModal: false,
    url: '',
    alt: '',
  };

  handleSearch = search => {
    this.setState({ search, page: 1, image: [] });
  };

  loadMore = async () => {
    this.setState(pS => ({
      page: pS.page + 1,
    }));
  };

  async componentDidUpdate(_, prevState) {
    const { page, search } = this.state;
    if (
      prevState.search !== this.state.search ||
      prevState.page !== this.state.page
    ) {
      this.setState({ isLoading: true });
      try {
        const { data } = await axios.get(
          `${BASE_URL}q=${search}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`
        );

        this.setState(prevState => ({
          image: [...prevState.image, ...data.hits],
          imageHits: data,
        }));

        if (this.state.image.length === 0) {
          toast.success(`We found ${data.total} images`);
        }

        if (data.total === 0) {
          this.setState({ image: [] });
        }
      } catch (error) {
        console.log(error);
        toast.error('Cannot process your request');
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }

  toggleModal = () => {
    this.setState(pS => ({
      showModal: !pS.showModal,
    }));
  };
  handleModal = (url, alt) => {
    this.toggleModal();
    this.setState({ url, alt });
  };

  render() {
    const { isLoading, image, imageHits, showModal, url, alt } = this.state;

    return (
      <Container>
        <SearchBar onSubmit={this.handleSearch} />

        {
          <ImageGallery>
            {
              <ImageGalleryItem
                image={image}
                onhandleModal={this.handleModal}
              />
            }
          </ImageGallery>
        }
        {isLoading && <Loader />}
        {<Toast />}
        {showModal && (
          <Modal onClose={this.toggleModal}>
            <ModalInner url={url} alt={alt} />
          </Modal>
        )}
        {image.length === 0 || imageHits.totalHits === image.length || (
          <Button onClick={this.loadMore} />
        )}
      </Container>
    );
  }
}
