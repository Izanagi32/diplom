document.addEventListener('DOMContentLoaded', function() {
    const fleetModal = document.getElementById('fleetModal');
    const fleetModalClose = fleetModal.querySelector('.fleet-modal__close');
    const fleetModalGrid = fleetModal.querySelector('.fleet-modal__grid');
    const viewAllButton = document.querySelector('.fleet-collage__view-all');

    const fleetData = [
        { id: 1, name: 'Mercedes-Benz Actros', image: './src/img/daf3477.jpg' },
        { id: 2, name: 'Mercedes-Benz Actros', image: './src/img/merc3522.jpg' },
        { id: 3, name: 'DAF XF', image: './src/img/daf7100.jpg' },
        { id: 4, name: 'DAF XF', image: './src/img/daf-auto1.jpg' },
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
