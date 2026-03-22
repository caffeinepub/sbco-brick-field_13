import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";

actor {
  type Stats = {
    totalOrders : Nat;
    closedOrders : Nat;
    pendingDelivery : Nat;
    completeDelivery : Nat;
    totalDueAmount : Nat;
    bricksDue : Nat;
  };

  var stats : Stats = {
    totalOrders = 0;
    closedOrders = 0;
    pendingDelivery = 0;
    completeDelivery = 0;
    totalDueAmount = 0;
    bricksDue = 0;
  };

  public query ({ caller }) func getStats() : async Stats {
    stats;
  };

  public type UpdateStatRequest = {
    totalOrders : ?Nat;
    closedOrders : ?Nat;
    pendingDelivery : ?Nat;
    completeDelivery : ?Nat;
    totalDueAmount : ?Nat;
    bricksDue : ?Nat;
  };

  public shared ({ caller }) func updateStats(request : UpdateStatRequest) : async () {
    stats := {
      totalOrders = switch (request.totalOrders) {
        case (?value) { value };
        case (null) { stats.totalOrders };
      };
      closedOrders = switch (request.closedOrders) {
        case (?value) { value };
        case (null) { stats.closedOrders };
      };
      pendingDelivery = switch (request.pendingDelivery) {
        case (?value) { value };
        case (null) { stats.pendingDelivery };
      };
      completeDelivery = switch (request.completeDelivery) {
        case (?value) { value };
        case (null) { stats.completeDelivery };
      };
      totalDueAmount = switch (request.totalDueAmount) {
        case (?value) { value };
        case (null) { stats.totalDueAmount };
      };
      bricksDue = switch (request.bricksDue) {
        case (?value) { value };
        case (null) { stats.bricksDue };
      };
    };
  };

  public shared ({ caller }) func incrementField(field : Text, amount : Nat) : async () {
    if (amount == 0) { Runtime.trap("Amount must be greater than 0.") };

    stats := switch (field) {
      case ("totalOrders") { { stats with totalOrders = stats.totalOrders + amount } };
      case ("closedOrders") { { stats with closedOrders = stats.closedOrders + amount } };
      case ("pendingDelivery") {
        { stats with pendingDelivery = stats.pendingDelivery + amount };
      };
      case ("completeDelivery") {
        { stats with completeDelivery = stats.completeDelivery + amount };
      };
      case ("totalDueAmount") { { stats with totalDueAmount = stats.totalDueAmount + amount } };
      case ("bricksDue") { { stats with bricksDue = stats.bricksDue + amount } };
      case (_) { Runtime.trap("Invalid field name.") };
    };
  };

  public shared ({ caller }) func decrementField(field : Text, amount : Nat) : async () {
    if (amount == 0) { Runtime.trap("Amount must be greater than 0.") };

    stats := switch (field) {
      case ("totalOrders") {
        if (amount > stats.totalOrders) { Runtime.trap("Cannot decrement beyond 0.") };
        { stats with totalOrders = stats.totalOrders - amount };
      };
      case ("closedOrders") {
        if (amount > stats.closedOrders) { Runtime.trap("Cannot decrement beyond 0.") };
        { stats with closedOrders = stats.closedOrders - amount };
      };
      case ("pendingDelivery") {
        if (amount > stats.pendingDelivery) { Runtime.trap("Cannot decrement beyond 0.") };
        { stats with pendingDelivery = stats.pendingDelivery - amount };
      };
      case ("completeDelivery") {
        if (amount > stats.completeDelivery) { Runtime.trap("Cannot decrement beyond 0.") };
        { stats with completeDelivery = stats.completeDelivery - amount };
      };
      case ("totalDueAmount") {
        if (amount > stats.totalDueAmount) { Runtime.trap("Cannot decrement beyond 0.") };
        { stats with totalDueAmount = stats.totalDueAmount - amount };
      };
      case ("bricksDue") {
        if (amount > stats.bricksDue) { Runtime.trap("Cannot decrement beyond 0.") };
        { stats with bricksDue = stats.bricksDue - amount };
      };
      case (_) { Runtime.trap("Invalid field name.") };
    };
  };
};
