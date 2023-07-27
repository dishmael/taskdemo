import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Table } from 'react-bootstrap'; 
import { TaskController } from './features/tasks';
import './App.css';
import { HelloWorld } from './features/hello';

export const App = () => {
  return (
    <Container className="mt-4">
      <Row><h3 className="mb-3">Tasks</h3></Row>
      
      <TaskController />
      
    </Container>
  );
}