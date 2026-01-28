import Layout from '../../components/Layout';
import team from '../../data/team';
import customerConfig from '../../data/customer-config';

export default function YourTeam() {
  const highlightedIds = customerConfig.assignedTeam || [];
  const highlightedMembers = team.filter((member) => highlightedIds.includes(member.id));
  const otherMembers = team.filter((member) => !highlightedIds.includes(member.id));

  const groupByRole = (members) => {
    return members.reduce((acc, member) => {
      if (!acc[member.role]) acc[member.role] = [];
      acc[member.role].push(member);
      return acc;
    }, {});
  };

  const highlightedGrouped = groupByRole(highlightedMembers);
  const otherGrouped = groupByRole(otherMembers);

  const TeamCard = ({ member, highlighted = false }) => (
    <div className="card" style={{ 
      border: highlighted ? '2px solid #7c3aed' : '1px solid #e5e7eb',
      position: 'relative',
    }}>
      {highlighted && (
        <div style={{
          position: 'absolute',
          top: '-0.5rem',
          right: '1rem',
          background: '#7c3aed',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.7rem',
          fontWeight: 600,
        }}>
          Your Team
        </div>
      )}
      <div style={{
        width: '100%',
        height: 180,
        background: 'linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%)',
        borderRadius: '8px',
        marginBottom: '1rem',
        backgroundImage: `url(${member.photo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {!member.photo && (
          <span style={{ fontSize: '3rem', color: '#9ca3af' }}>👤</span>
        )}
      </div>
      <h3 style={{ color: '#7c3aed', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
        {member.name}
      </h3>
      <div style={{ 
        display: 'inline-block',
        background: member.role === 'Architect' ? '#dbeafe' : '#fef3c7',
        color: member.role === 'Architect' ? '#1d4ed8' : '#92400e',
        padding: '0.2rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.7rem',
        fontWeight: 600,
        marginBottom: '0.75rem',
      }}>
        {member.role}
      </div>
      <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', fontSize: '0.85rem', lineHeight: 1.6, color: '#374151' }}>
        {member.experience.map((exp, i) => (
          <li key={i}>{exp}</li>
        ))}
      </ul>
      <p style={{ fontSize: '0.85rem', color: '#6b7280', fontStyle: 'italic' }}>
        {member.personal}
      </p>
    </div>
  );

  const RoleSection = ({ role, members, highlighted = false }) => (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
      }}>
        <span style={{ 
          fontSize: '1.25rem',
          background: role === 'Architect' ? '#dbeafe' : '#fef3c7',
          padding: '0.5rem',
          borderRadius: '8px',
        }}>
          {role === 'Architect' ? '🏗️' : '⚙️'}
        </span>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{role}s</h3>
        <span style={{ 
          background: '#f3f4f6', 
          padding: '0.25rem 0.5rem', 
          borderRadius: '9999px', 
          fontSize: '0.8rem',
          color: '#6b7280',
        }}>
          {members.length}
        </span>
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {members.map((member) => (
          <TeamCard key={member.id} member={member} highlighted={highlighted} />
        ))}
      </div>
    </div>
  );

  return (
    <Layout title="Your Team">
      <div className="container" style={{ maxWidth: 1100 }}>
        <div className="page-header">
          <h1 className="page-title">
            <span>👥</span> Your Team
          </h1>
          <p style={{ color: '#6b7280', maxWidth: 600, margin: '0 auto' }}>
            Meet the LeanScale operators who will be working with you. Our team combines deep GTM expertise with technical implementation skills.
          </p>
        </div>

        {highlightedMembers.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', 
              padding: '2rem', 
              borderRadius: '16px',
              marginBottom: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>⭐</span>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Your Assigned Team</h2>
              </div>
              
              {Object.entries(highlightedGrouped).map(([role, members]) => (
                <RoleSection key={role} role={role} members={members} highlighted={true} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏢</span>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
              {highlightedMembers.length > 0 ? 'Full LeanScale Roster' : 'LeanScale Team'}
            </h2>
            <span style={{ 
              background: '#f3f4f6', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '9999px', 
              fontSize: '0.85rem',
              color: '#6b7280',
            }}>
              {highlightedMembers.length > 0 ? otherMembers.length : team.length} members
            </span>
          </div>
          
          {highlightedMembers.length > 0 ? (
            Object.entries(otherGrouped).map(([role, members]) => (
              <RoleSection key={role} role={role} members={members} />
            ))
          ) : (
            Object.entries(groupByRole(team)).map(([role, members]) => (
              <RoleSection key={role} role={role} members={members} />
            ))
          )}
        </section>

        <div style={{ 
          marginTop: '3rem', 
          padding: '2rem', 
          background: '#f9fafb', 
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Want to meet your team?</h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Schedule a kickoff call to meet the operators assigned to your engagement.
          </p>
          <a href="/buy-leanscale" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary">Get Started</button>
          </a>
        </div>
      </div>
    </Layout>
  );
}
