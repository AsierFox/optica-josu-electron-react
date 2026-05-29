import { Card, Col, Row, Spin, Typography } from 'antd';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import ClientModel from '../../../main/models/client.model';

const { Text } = Typography;

interface Props {
  clients: ClientModel[];
}

interface MapPoint {
  lat: number;
  lng: number;
}

const HeatLayerComponent = ({ points }: { points: MapPoint[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    // Convertimos los puntos al formato de leaflet.heat: [[lat, lng, intensidad]]
    const heatData = points.map(
      (p) => [p.lat, p.lng, 1] as [number, number, number],
    );

    // Creamos la capa de calor y la añadimos al mapa
    const heatLayer = (L as any)
      .heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 10,
        gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' },
      })
      .addTo(map);

    // Limpiamos la capa cuando el componente se desmonte o cambien los puntos
    return () => map.removeLayer(heatLayer);
  }, [map, points]);

  return null;
};

const ClientStats: React.FC<Props> = ({ clients }) => {
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [loadingMap, setLoadingMap] = useState(false);

  useEffect(() => {
    const geocodeAddresses = async () => {
      setLoadingMap(true);
      const alreadySearchedCity: Record<string, string> = {};
      const searchedLatLng: Record<string, MapPoint> = {};

      const geolocatingLatLng = clients.map(
        async (client: ClientModel): Promise<MapPoint | null> => {
          if (!client.ciudad) {
            return null;
          }
          if (alreadySearchedCity[client.ciudad]) {
            return searchedLatLng[client.ciudad];
          }
          try {
            // Llamamos al proceso Main a través de preload para saltarnos el CORS
            const data =
              await window.electron.ipcGeneric.fetchAddressCoordinates(
                client.ciudad,
              );

            if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lng = parseFloat(data[0].lon);
              alreadySearchedCity[client.ciudad] = client.ciudad;
              searchedLatLng[client.ciudad] = { lat, lng };
              return searchedLatLng[client.ciudad];
            }
          } catch {
            console.log('Error geocodificando desde el Main:', client.ciudad);
          }
          return null;
        },
      );

      const geolocatedLatLng = (await Promise.all(geolocatingLatLng)).filter(
        (latLng): latLng is MapPoint => !!latLng,
      );
      setMapPoints(geolocatedLatLng);
      setLoadingMap(false);
    };

    if (clients.length > 0) {
      geocodeAddresses();
    }
  }, [clients]);

  // Coordenadas predeterminadas para centrar el mapa
  const mapCenter: [number, number] = [43.052599, -3.00182];

  return (
    <div style={{ marginTop: 16 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Text strong style={{ fontSize: '18px' }}>
                Clientes por Ciudad
              </Text>
            }
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{ height: '400px', width: '100%', position: 'relative' }}
            >
              {loadingMap && (
                <div
                  style={{
                    position: 'absolute',
                    zIndex: 1000, // Leaflet usa z-index altos, ponemos uno superior para el spinner
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255,255,255,0.8)',
                    padding: '20px',
                    borderRadius: '8px',
                  }}
                >
                  <Spin size="large" tip="Geocodificando direcciones..." />
                </div>
              )}

              <MapContainer
                center={mapCenter}
                zoom={9}
                style={{ height: '100%', width: '100%', borderRadius: '8px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {mapPoints.length > 0 && (
                  <HeatLayerComponent points={mapPoints} />
                )}
              </MapContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(ClientStats);
