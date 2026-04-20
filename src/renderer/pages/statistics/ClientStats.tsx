/* eslint-disable no-undef */
/* eslint-disable react/jsx-props-no-spreading */
import { GoogleMap, HeatmapLayer, LoadScript } from '@react-google-maps/api';
import { Card, Col, Row, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import ClientModel from '../../../main/models/client.model';

const { Text } = Typography;

interface Props {
  clients: ClientModel[];
}

const ClientStats: React.FC<Props> = ({ clients }) => {
  const [mapPoints, setMapPoints] = useState<google.maps.LatLng[]>([]);
  const [loadingMap, setLoadingMap] = useState(false);

  useEffect(() => {
    const geocodeAddresses = async () => {
      setLoadingMap(true);
      const alreadySearchedLatLng: Record<string, google.maps.LatLng> = {};

      const geolocatingLatLng = clients.map(
        async (client: ClientModel): Promise<google.maps.LatLng | null> => {
          if (!client.ciudad) {
            return null;
          }
          if (alreadySearchedLatLng[client.ciudad]) {
            return alreadySearchedLatLng[client.ciudad];
          }
          try {
            // Nominatim para geocodificar gratis
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(client.ciudad)}&limit=1`,
            );
            const data = await response.json();
            if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lng = parseFloat(data[0].lon);
              alreadySearchedLatLng[client.ciudad] =
                new window.google.maps.LatLng(lat, lng);
              return alreadySearchedLatLng[client.ciudad];
            }
          } catch {
            console.log('Error geocodificando:', client.ciudad);
          }
          return null;
        },
      );

      const geolocatedLatLng = (await Promise.all(geolocatingLatLng)).filter(
        (latLng) => !!latLng,
      );
      setMapPoints(geolocatedLatLng);
      setLoadingMap(false);
    };

    if (clients.length > 0) {
      geocodeAddresses();
    }
  }, [clients]);

  const mapCenter = { lat: 43.052599929179316, lng: -3.0018205318666356 };

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
                    zIndex: 10,
                    top: '50%',
                    left: '50%',
                  }}
                >
                  <Spin size="large" tip="Geocodificando direcciones..." />
                </div>
              )}

              <LoadScript
                googleMapsApiKey="GOOGLE_API_KEY"
                libraries={['visualization']}
              >
                <GoogleMap
                  mapContainerStyle={{
                    height: '100%',
                    width: '100%',
                    borderRadius: '8px',
                  }}
                  center={mapCenter}
                  zoom={9}
                >
                  {mapPoints.length > 0 && (
                    <HeatmapLayer
                      data={mapPoints}
                      options={{
                        radius: 30,
                        opacity: 0.7,
                      }}
                    />
                  )}
                </GoogleMap>
              </LoadScript>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(ClientStats);
