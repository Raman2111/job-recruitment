import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CompanyLayouts from '../../layouts/company.profile.layouts';
import { getDecoded, getToken } from '../../auth/auth.states';
import { observer } from 'mobx-react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const FreshAndExperience = observer(() => {
  const [users, setUsers] = useState([]);
  const [credit, setCredit] = useState(0);
  const [sortBy, setSortBy] = useState('experience');
  const history = useHistory();

  useEffect(() => {
    axios
      .get(`/api/profiles/${getDecoded()?.id}`, {
        headers: {
          Authorization: getToken(),
        },
      })
      .then((res) => {
        setCredit(res.data.user.credit);
      })
      .catch((err) => {});
    axios
      .get(`/api/profiles/fresh-and-experience`, {
        headers: {
          Authorization: getToken(),
        },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {});

    return () => {};
  }, [history]);

  const renderUsers = () => {
    const sorted = users
      .filter((profile) => profile?.user?.role === 'user')
      .sort((a, b) =>
        sortBy === 'experience'
          ? b.skills.length - a.skills.length
          : a.skills.length - b.skills.length
      );

    return sorted.map((profile, i) => {
      return (
        <tr>
          <td>{i + 1}</td>
          <td>
            <Link to={`/profile/user/${profile.user._id}`}>{profile.user.name}</Link>
          </td>
          <td>
            <a href={`mailto:${profile.user.email}`}>{profile.user.email}</a>
          </td>
          <td>{profile.skills.reduce((acc, val) => acc + ' ' + val.name, '')}</td>
        </tr>
      );
    });
  };

  return (
    <CompanyLayouts page='company-profile' credit={credit}>
      <div style={{ display: 'flex' }}>
        <select onChange={(e) => setSortBy(e.target.value)} name='' id=''>
          <option value='experience'>Experienced</option>
          <option value='fresh'>Fresh</option>
        </select>
      </div>
      <Row className='my-8 flex-wrap'>
        <Col xs={12} md={12} className='p-2'>
          <Table striped bordered hover>
            <tr>
              <th>SN</th>
              <th>User</th>
              <th>Email</th>
              <th>Skills</th>
            </tr>
            {renderUsers()}
          </Table>
        </Col>
      </Row>
      <hr />
    </CompanyLayouts>
  );
});

export default FreshAndExperience;
