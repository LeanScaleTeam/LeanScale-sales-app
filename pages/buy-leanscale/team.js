import Layout from '../../components/Layout';
import team from '../../data/team';
import customerConfig from '../../data/customer-config';

export default function YourTeam() {
  // Filter to only show assigned team members (or all if none specified)
  const displayTeam = customerConfig.assignedTeam?.length
    ? team.filter((member) => customerConfig.assignedTeam.includes(member.id))
    : team;

  // Group by role
  const groupedTeam = displayTeam.reduce((acc, member) => {
    if (!acc[member.role]) acc[member.role] = [];
    acc[member.role].push(member);
    return acc;
  }, {});

  return (
    <Layout title="Your Team">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>👤</span> Your Team
          </h1>
        </div>

        {Object.entries(groupedTeam).map(([role, members]) => (
          <section key={role} style={{ marginBottom: '3rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              padding: '0.5rem 0',
              borderBottom: '1px solid var(--ls-light-gray)',
            }}>
              <span>▼</span>
              <h2 style={{ fontSize: '1rem', fontWeight: 500 }}>{role}</h2>
              <span style={{ color: '#666', fontSize: '0.875rem' }}>{members.length}</span>
            </div>

            <div className="card-grid">
              {members.map((member) => (
                <div key={member.id} className="card">
                  <div style={{
                    width: '100%',
                    height: 200,
                    background: 'var(--ls-light-gray)',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    backgroundImage: `url(${member.photo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }} />
                  <h3 style={{ color: 'var(--ls-purple)', marginBottom: '0.5rem' }}>
                    {member.name}
                  </h3>
                  <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {member.experience.map((exp, i) => (
                      <li key={i}>{exp}</li>
                    ))}
                  </ul>
                  <p style={{ fontSize: '0.875rem', color: '#666', fontStyle: 'italic' }}>
                    {member.personal}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Layout>
  );
}
