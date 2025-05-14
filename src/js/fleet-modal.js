document.addEventListener('DOMContentLoaded', function() {
    const fleetModal = document.getElementById('fleetModal');
    const fleetModalClose = fleetModal.querySelector('.fleet-modal__close');
    const fleetModalGrid = fleetModal.querySelector('.fleet-modal__grid');
    const viewAllButton = document.querySelector('.fleet-collage__view-all');

    const fleetData = [
        { id: 1, name: 'Mercedes-Benz Actros', image: './src/img/MERC3477.avif' },
        { id: 2, name: 'Mercedes-Benz Actros', image: './src/img/MERC3522.avif' },
        { id: 3, name: 'DAF XF', image: './src/img/DAF7100.avif' },
        { id: 4, name: 'DAF XF', image: './src/img/DAF7066.avif' },
        { id: 5, name: 'DAF XF', image: './src/img/DAF7488.avif' },
        { id: 6, name: 'DAF XF', image: './src/img/DAF9990.avif' },
        { id: 7, name: 'DAF XF', image: './src/img/DAF0833.avif' },
    ];

    viewAllButton.addEventListener('click', function() {
        fleetModal.style.display = 'flex';
        populateFleetModal();
    });

    fleetModalClose.addEventListener('click', function() {
        fleetModal.style.display = 'none';
    });

    function populateFleetModal() {
        fleetModalGrid.innerHTML = '';
        fleetData.forEach(vehicle => {
            const vehicleCard = document.createElement('div');
            vehicleCard.className = 'fleet-modal__card';
            vehicleCard.innerHTML = `
                <div class="fleet-modal__image-container">
                    <img src="${vehicle.image}" alt="${vehicle.name}" class="fleet-modal__image">
                </div>
                <div class="fleet-modal__image-zoomed-wrapper">
                    <img src="${vehicle.image}" alt="${vehicle.name}" class="fleet-modal__image-zoomed">
                </div>
                <h3 class="fleet-modal__name">${vehicle.name}</h3>
            `;
            fleetModalGrid.appendChild(vehicleCard);

            const imgContainer = vehicleCard.querySelector('.fleet-modal__image-container');
            const zoomedWrapper = vehicleCard.querySelector('.fleet-modal__image-zoomed-wrapper');

            imgContainer.addEventListener('mouseenter', () => {
                zoomedWrapper.style.opacity = '1';
                zoomedWrapper.style.pointerEvents = 'auto';
            });

            zoomedWrapper.addEventListener('mouseleave', () => {
                zoomedWrapper.style.opacity = '0';
                zoomedWrapper.style.pointerEvents = 'none';
            });
        });
    }

    document.querySelectorAll('.fleet-modal__image-container').forEach(container => {
        container.addEventListener('click', function() {
            this.style.position = '';
            this.style.width = '';
            this.style.height = '';
        });
    });
});
